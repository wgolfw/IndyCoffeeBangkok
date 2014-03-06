var historyPage = null;

function jsDecode(obj) {
    return  (JSON.stringify(obj)).replace(/\"/g, "|");
}
function jsEncode(str) {
    return  JSON.parse(str.replace(/\|/g, "\""));
}
function eachOne(obj) {
    var x = null;
    $.each(obj, function(key, item) {
        x = item;
    });
    return x;
}
function galleryHeight() {
    var galleryHeight = parseInt(0.578125 * $(window).width());
    galleryHeight = $(window).width() / 2;
    $('.swiper').height(galleryHeight);
}
function openBrowser(url, target) {

    if (target === null) {
        target = "_blank";
    }

    var ref = window.open(url, "_blank", 'location=yes');
    ref.addEventListener('loadstart', function() {
    });
}
function iOSversion() {
    if (/iP(hone|od|ad)/.test(navigator.platform)) {
        var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
        return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
    }
}
function setCafeMapDetails() {
    var windowWidth = $(window).width();
//    if (windowWidth < 600) {
//       
//        $('.cafe-map').height(windowWidth / 1.33);
//    } else {
//      
//          $('.cafe-map').height(windowWidth / 2);
//    }
    $('.cafe-map').height(windowWidth / 2);

    $('.cafe-map').width(windowWidth - (17 * 2));
}
function setWidthNewsList() {
    var windowWidth = $(window).width();
    var newsThumb = $('.news-list ul li .data-detail .thumb-list').width();
    $('.news-list ul li .data-detail .desc').width(windowWidth - newsThumb - 20);
}


$(function() {

    if (isMobile()) {
        document.addEventListener("deviceready", onDeviceReady, false);
    } else {
        onDeviceReady();
    }


});


$(window).resize(function() {
    $.contentPage().fitSize();
    $('#map_canvas').height($.contentPage().getHeight());


    setCafeMapDetails();
    var windowWidth = $(window).width();
    $('.brewing-slide').width(windowWidth - (17 * 2));

    setWidthNewsList();
    galleryHeight();



});

$(window).load(function() {

});

$(window).on('hashchange', function() {
    /*
    var hash = getHash();

    $('.btn-back-icon').hide();

    if ((hash !== "map") && (hash.search("map") !== -1)) {
        var cafeId = (hash.split('='))[1];



        $('a[data-id="' + cafeId + '"]').trigger("click");
        historyPage = 'MAP-DETAILS';
    }

    $('#page-cafe-details').empty();
    */
    //console.log('PAGE HISTORY: ' + historyPage);

});

