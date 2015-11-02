+(function ($) {
    //load theme
    if (getCookie("themeStyle") == "") {
        var h = new Date().getHours();
        if (h >= 7 && h <= 20) {
            setCookie("themeStyle", "light");
        } else {
            setCookie("themeStyle", "dark");
        }
    }
    changeTheme(getCookie("themeStyle"))
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
    )
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
////
//$('.blog-list #list-group').infinitescroll({
//    debug: false,
//    loadingText: "Loading the next page...",
//    donetext: "end",
//    nextSelector: "#blog-list .pagination a.next-page",
//    navSelector: "#blog-list .pagination",
//    contentSelector: ".blog-list #list-group",
//    itemSelector: ".blog-list #list-group > article"
//}, function () {
//
//});
    headroomInit();
})
(jQuery);

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
            loadBlogByURL(link);
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
    loadBlogByURL(url);
}

function loadBlogListByURL(url, isSetPushState) {
    $.ajax({
        type: "get",
        url: url,
        timeout: 10000,
        beforeSend: function () {
            NProgress.start();
        },
        success: function (dates) {
            if (isSetPushState) {
                history.pushState(null, null, url);
            }
            $("#blog-list").html($("#blog-list", $.parseHTML(dates)).html());
        },
        complete: function () {
            NProgress.done();
        },
        error: function () {
            alert("失败，请稍后再试！");
        }
    });
}

function loadBlogByURL(url) {
    $.ajax({
        type: "get",
        url: url,
        timeout: 10000,
        beforeSend: function () {
            NProgress.start();
        },
        success: function (dates) {
            history.pushState(null, null, url);
            var html = $.parseHTML(dates);
            smallScreenPageChange(2);
            $("#blog-view").html($("#blog-view", html).html());
            Prism.highlightAll();
            document.title = $(".blog-view-title", html).html();
            headroomInit();
        },
        complete: function () {
            NProgress.done();
        },
        error: function () {
            alert("失败，请稍后再试！");
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

function headroomInit() {
    var myElement = document.querySelector("#blog-view-header");
    if (myElement == null) {
        return;
    }
    var headroom = new Headroom(myElement, {
        tolerance: 5,
        "classes" : {
            "initial" : "animated",
            "pinned": "flipInX",
            "unpinned": "flipOutX"
        },
        scroller: document.querySelector(".blog-view-container")
    });
    headroom.init();
}

function setCookie(c_name, value, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + "=" + escape(value) +
        ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
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