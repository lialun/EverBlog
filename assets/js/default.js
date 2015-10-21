+(function ($) {
    //
    var url = window.location.href;
    //navigation active
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
})(jQuery);

function navigationFunction(obj) {
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
            $("#blog-view").html($("#blog-view", html).html());
            document.title = $(".blog-view-title", html).html();
        },
        complete: function () {
            NProgress.done();
        },
        error: function () {
            alert("失败，请稍后再试！");
        }
    });
}