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
})(jQuery);

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
        scroller: document.querySelector(".blog-view-container")
    });
    headroom.init();
}