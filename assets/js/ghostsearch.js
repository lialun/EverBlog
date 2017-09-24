function Ajax() {
    "use strict";
    var aja = {};
    aja.tarUrl = '';
    aja.postString = '';
    aja.xhr = new XMLHttpRequest();
    aja.processHandler = function () {
        if (aja.xhr.readyState === 4 && aja.xhr.status === 200)
            aja.resultHandler(aja.xhr.responseText);
    };
    aja.get = function (tarUrl, callbackHandler) {
        aja.tarUrl = tarUrl;
        aja.resultHandler = callbackHandler;
        aja.xhr.onreadystatechange = aja.processHandler;
        aja.xhr.open('get', aja.tarUrl, true);
        aja.xhr.send();
    };
    return aja;
}

GhostSearch = function (config) {
    this.init(config);
};

GhostSearch.prototype.init = function (config) {
    this.result_template = config.result_template;
    this.info_template = config.info_template;
    this.targetId = config.targetId;
    this.inputId = config.inputId;
    this.status_change_callback = config.status_change_callback;
    this.blogData = [];
    this.ajax = new Ajax();
    this.loadAPI();
    this.listen();
};

GhostSearch.prototype.loadAPI = function () {
    if (this.inited) return false;
    var that = this;
    var obj = {limit: "all", include: "tags", formats: "plaintext"};
    var blogData = [];
    this.ajax.get(ghost.url.api('posts', obj), function (data) {
        var searchData = JSON.parse(data).posts;
        searchData.forEach(function (arrayItem) {
            var tag_arr = arrayItem.tags.map(function (v) {
                return v.name;
            });
            if (arrayItem.meta_description === null) {
                arrayItem.meta_description = ''
            }
            if (arrayItem.custom_excerpt === null) {
                arrayItem.custom_excerpt = ''
            }
            var tag = tag_arr.join(", ");
            if (tag.length < 1) {
                tag = "undefined";
            }
            var parsedData = {
                id: String(arrayItem.id),
                title: String(arrayItem.title),
                description: String(arrayItem.meta_description),
                plaintext: String(arrayItem.plaintext),
                pubDate: String(arrayItem.created_at.split('T')[0]),
                tag: tag,
                url: String(arrayItem.url),
                custom_excerpt: String(arrayItem.custom_excerpt),
                excerpt_or_content: arrayItem.custom_excerpt.length > 1 ? arrayItem.custom_excerpt : arrayItem.plaintext
            };
            blogData.push(parsedData);
        });
        that.blogData = blogData;
        that.inited = true;
    })
};

GhostSearch.prototype.listen = function () {
    var that = this;
    var inputEle = document.querySelector(that.inputId);
    if (inputEle === null) {
        return
    }
    ['input', 'propertychange'].forEach(event => {
            inputEle.removeEventListener(event, search, false);
            inputEle.addEventListener(event, search, false)
        }
    );

    function search(inputEle) {
        var ele = inputEle.target;
        var targetEle = document.querySelector(that.targetId);
        if (!ele.value) {
            targetEle.innerHTML = '';
            that.status_change_callback(false);
        } else {
            var _r = that.search(ele.value); //[{}, {}]
            var _HTML = that.format(that.info_template, {
                amount: _r.length
            });
            for (i in _r) _HTML += that.format(that.result_template, _r[i]);
            targetEle.innerHTML = _HTML;
            that.status_change_callback(true);
        }
    }
};

GhostSearch.prototype.format = function (text, obj) {
    return text.replace(/{{([^{}]*)}}/g, function (a, b) {
        var r = obj[b];
        return typeof r === "string" || typeof r === "number" ? r : a
    })
};

GhostSearch.prototype.search = function (searchKeyword) {
    var _result = [];
    var searchKeywords = searchKeyword.toLowerCase().replace(/(^\s+)|(\s+$)/g, "").split(" ");
    var regexWord = "^";
    searchKeywords.forEach(kw => regexWord = regexWord + "(?=.*" + kw + ")");
    regexWord = regexWord + ".*$";
    var regex = new RegExp(regexWord);
    this.blogData.forEach(function (i) {
        if (regex.test((i.title.toLowerCase() + i.custom_excerpt.toLowerCase() + i.plaintext.toLowerCase() + i.pubDate.toLowerCase() + i.url.toLowerCase()).replace(/[\n\r]/g, ""))) {
            _result.push(i)
        }
    });
    return _result;
};