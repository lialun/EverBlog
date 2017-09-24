var needInitSearchListener = true;
+(function ($) {
    //load theme
    if (getCookie("themeStyle") === "") {
        if (default_theme === "default") {
            var h = new Date().getHours();
            if (h >= 7 && h <= 20) {
                setCookie("themeStyle", "light");
            } else {
                setCookie("themeStyle", "dark");
            }
        } else if (default_theme === "dark") {
            setCookie("themeStyle", "dark");
        } else {
            setCookie("themeStyle", "light");
        }
    }
    changeTheme(getCookie("themeStyle"));
    //navigation active
    var url = window.location.href;
    var isMatchingCategory = false;
    $("#category-list a").each(
        function () {
            if ($(this).attr("href") == url) {
                $(this).addClass("active");
                isMatchingCategory = true;
                return false;
            }
        }
    );
    //load blog list(if url is blog, page do not has blog list in default)
    if ($("#blog-list .list-group").text().trim().length == 0) {
        //load first navigation link
        var firstNavigationLink = $("#category-list .nav-item a").first();
        url = firstNavigationLink.attr("href");
        loadBlogListByURL(url, false);
        if (!isMatchingCategory) {
            firstNavigationLink.addClass("active");
        }
    }
    //load default blog (if url is main page or tag, blog content page will be blank)
    if ($("#blog-view").text().trim().length == 0 && default_post != "") {
        loadBlogByURL(default_post, false, false, false);
    }
    //Scroll4Ever
    bindScroll4Ever();
    //loading bar
    headroomInit();
    //search
    var ghost = new GhostSearch({
        inputId: ".search-form-input",
        targetId: ".search-result-container",
        info_template: "<div class=\"search-info\">{{amount}} articles</div>",
        result_template: "<article href={{url}} class='list-group-item blog-excerpt' onclick='loadBlog(this)'>" +
        "<div class=\"blog-excerpt-title text-overflow\">" +
        "{{title}}" +
        "</div>" +
        "<div class=\"blog-excerpt-date text-overflow\">" +
        "{{pubDate}}" +
        "</div>" +
        "<div class=\"blog-excerpt-content\">" +
        "{{excerpt_or_content}}" +
        "</div>\n" +
        "</article>",
        status_change_callback: searchStatusChange
    });
    $(document).ajaxComplete(function () {
        if (needInitSearchListener) {
            ghost.listen();
            needInitSearchListener = false;
        }
        svgImage();
    });
    //search style
    SearchStyleInit();


    jQuery('img.svg').each(function () {
        var $img = jQuery(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');

        jQuery.get(imgURL, function (data) {
            // Get the SVG tag, ignore the rest
            var $svg = jQuery(data).find('svg');

            // Add replaced image's ID to the new SVG
            if (typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if (typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass + ' replaced-svg');
            }

            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');

            // Check if the viewport is set, else we gonna set it if we can.
            if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
                $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
            }

            // Replace image with new SVG
            $img.replaceWith($svg);

        }, 'xml');

    });
})(jQuery);

function searchStatusChange(isHaveSearch) {
    if (isHaveSearch) {
        $(".search-result-list").show();
        $(".blog-except-list").hide();
    } else {
        $(".search-result-list").hide();
        $(".blog-except-list").show();
    }
}

function navigationFunction(obj) {
    //
    $(obj).parent().siblings().children().removeClass("active");
    $(obj).addClass("active");
    //
    var host = window.location.host;
    var link = $(obj).attr("href");
    if (link.match("^(http|https)://" + host + "/.*", "i")) {
        if (link.match("^(http|https)://" + host + "/tag/.*", "i") || link.match("^(http|https)://" + host + "/?$", "i")) {
            loadBlogListByURL(link, true);
        } else if (link.match("^(http|https)://" + host + "/.*/$", "i")) {
            loadBlogByURL(link, true, true, true);
        } else {
            window.open(link, '_self')
        }
    } else {
        window.open(link)
    }
}

function loadBlog(obj) {
    //change blog-list active element
    $(obj).siblings().removeClass("active");
    $(obj).addClass("active");
    //load blog
    var url = $(obj).attr("href");
    loadBlogByURL(url, true, true, true);
}

function loadBlogListByURL(url, isSetReplaceState) {
    $.ajax({
        type: "get",
        url: url,
        timeout: 10000,
        beforeSend: function () {
            NProgress.start();
        },
        success: function (dates) {
            if (isSetReplaceState) {
                history.replaceState(null, null, url);
            }
            $("#blog-list").html($("#blog-list", $.parseHTML(dates)).html());
            bindScroll4Ever();
            headroomInit();
            SearchStyleInit();
            needInitSearchListener = true;
        },
        complete: function () {
            NProgress.done();
        },
        error: function () {
            alert("Something went wrong!");
        }
    });
}

function loadBlogByURL(url, isSetReplaceState, isChangeScreen, isShowAlert) {
    $.ajax({
        type: "get",
        url: url,
        timeout: 10000,
        beforeSend: function () {
            NProgress.start();
        },
        success: function (dates) {
            if (isSetReplaceState) {
                history.replaceState(null, null, url);
            }
            var html = $.parseHTML(dates);
            if (isChangeScreen) {
                smallScreenPageChange(2);
            }
            $("#blog-view").html($("#blog-view", html).html());
            Prism.highlightAll();
            document.title = $(".blog-view-title", html).html();
            headroomInit();
        },
        complete: function () {
            NProgress.done();
        },
        error: function () {
            if (isShowAlert) {
                alert("Something went wrong! please try again later.");
            }
        }
    });
}

function bigScreenPageChange(page) {
    if (page == 1) {
        $("#left-bar").removeClass("hidden-md").removeClass("hidden-lg");
        $("#blog-view").addClass("hidden-md").addClass("hidden-lg");
    } else if (page == 2) {
        $("#left-bar").addClass("hidden-md").addClass("hidden-lg");
        $("#blog-view").removeClass("hidden-md").removeClass("hidden-lg");
    }
}

function smallScreenPageChange(page) {
    if (page == 1) {
        $("#left-bar").removeClass("hidden-xs").removeClass("hidden-sm");
        $("#blog-view").addClass("hidden-xs").addClass("hidden-sm");
    } else if (page == 2) {
        $("#left-bar").addClass("hidden-xs").addClass("hidden-sm");
        $("#blog-view").removeClass("hidden-xs").removeClass("hidden-sm");
    }
}

var loading = false;

function loadBlogListNextPage() {
    var scope = $("#pagination #next-page");
    scope.html('Loading next...');
    loading = true;
    var url = $('#pagination #next-page').attr('href');
    $('<div></div>').load(url, function (responseText, textStatus, XMLHttpRequest) {
        if (textStatus == "success") {
            scope.replaceWith($(this).find("#pagination #next-page"));
            $("#blog-list .list-container").append($(this).find("#blog-list .list-container").children());
        } else {
            scope.html('Failed to load, click to try again');
        }
        loading = false;
    });
}

function bindScroll4Ever() {
    $("#blog-list .scroll").scroll(function () {
        var scrollTop = $("#blog-list .blog-except-list").scrollTop();//scroll distance
        var listGroupScreenHeight = $("#blog-list .blog-except-list").height();//scroll height
        var listGroupRealHeight = 0;
        $("#blog-list .blog-except-list .list-container").children().each(function () {
            listGroupRealHeight += $(this).height();
        });
        //scroll height + scroll distance + 100>element real height
        if (listGroupScreenHeight + scrollTop + 100 >= listGroupRealHeight) {
            if (!loading) {
                $("#pagination #next-page").trigger('click');
            }
        }
    });
}

function headroomInit() {
    const blog_view_header_ele = document.querySelector("#blog-view-header");
    if (blog_view_header_ele !== null) {
        new Headroom(blog_view_header_ele, {
            "offset": 100,
            "tolerance": 0,
            "classes": {
                "initial": "animated",
                "pinned": "bounceInDown",
                "unpinned": "bounceOutUp"
            },
            scroller: document.querySelector(".blog-view-container")
        }).init()
    }
}

function SearchStyleInit() {
    if (!String.prototype.trim) {
        (function () {
            // Make sure we trim BOM and NBSP
            var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
            String.prototype.trim = function () {
                return this.replace(rtrim, '');
            };
        })();
    }
    [].slice.call(document.querySelectorAll('input.input__field')).forEach(function (inputEl) {
        // in case the input is already filled..
        if (inputEl.value.trim() !== '') {
            inputEl.parentNode.classList.add('input--filled')
        }
        // events:
        inputEl.addEventListener('focus', onInputFocus);
        inputEl.addEventListener('blur', onInputBlur);
    });

    function onInputFocus(ev) {
        ev.target.parentNode.classList.add('input--filled')
    }

    function onInputBlur(ev) {
        if (ev.target.value.trim() === '') {
            ev.target.parentNode.classList.remove('input--filled')
        }
    }
}

function setCookie(c_name, value, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + "=" + escape(value) +
        ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ";path=/"
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}

function loadCss(href) {
    if ($("#defaultStyle").length < 1) {
        var style = document.createElement('link');
        style.rel = 'stylesheet';
        style.type = 'text/css';
        style.id = 'defaultStyle';
        style.href = href;
        document.getElementsByTagName('HEAD').item(0).appendChild(style);
    } else {
        $("#defaultStyle").attr("href", href);
    }
}

function changeTheme(theme) {
    if (theme == "light") {
        $("#style-changer #light").css('display', 'none');
        $("#style-changer #dark").css('display', 'inline-block');
        loadCss(light_theme);
        setCookie("themeStyle", "light");
    } else {
        $("#style-changer #light").css('display', 'inline-block');
        $("#style-changer #dark").css('display', 'none');
        loadCss(dark_theme);
        setCookie("themeStyle", "dark");
    }
}

function svgImage() {
    jQuery('img.svg').each(function () {
        var $img = jQuery(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');

        jQuery.get(imgURL, function (data) {
            // Get the SVG tag, ignore the rest
            var $svg = jQuery(data).find('svg');

            // Add replaced image's ID to the new SVG
            if (typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if (typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass + ' replaced-svg');
            }

            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');

            // Check if the viewport is set, else we gonna set it if we can.
            if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
                $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
            }

            // Replace image with new SVG
            $img.replaceWith($svg);

        }, 'xml');
    });
}
