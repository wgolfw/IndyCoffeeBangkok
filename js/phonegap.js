/*if (isMobile()) {
 $.getScript("cordova.js");
 }*/

var devicePlatform = null;
var isOnDeviceReadyEventActive = 0;
var isOnOfflineEventActive = 0;


function onResume() {
    console.log('EVENT RESUME');
    ++isOnDeviceReadyEventActive;

    onDeviceReady();

}

function onOnline() {

    if (isOnOfflineEventActive >= 1) {
        window.location.reload();
        isOnOfflineEventActive = 0;
    }


    /*
     ++isOnDeviceReadyEventActive;
     console.log('EVENT ONLINE');
     onDeviceReady();
     */


}
function onOffline() {
    if (getStateInternet() === false) {
        ++isOnOfflineEventActive;
        navigator.notification.confirm(
                'Please connect internet', // message
                onConnectionInternet, // callback to invoke
                'Internet lost', // title
                'Continue,Try again', // buttonLabels
                '' // defaultText
                );


    }
}

function onConnectionInternet(buttonIndex) {
    console.log(lastSyncDateCompleted);
    if (buttonIndex == 2) {
        var checkState = setInterval(function() {
            if (getStateInternet() === false) {
                clearInterval(checkState);
                onOffline();
            } else {
                onDeviceReady();
                clearInterval(checkState);
            }
        }, 100);
    } else {
        $.freeze().hide();
        //onDeviceReady();
        //onResume();
        //navigator.app.exitApp();

    }


}

function onDeviceReady() {

//    ver = iOSversion();
//
//    if (ver[0] >= 5) {
//
//    }


    if (isOnDeviceReadyEventActive > 1) {
        return false;
    }

    if (isMobile()) {
        devicePlatform = device.platform;
    }

    document.addEventListener("resume", onResume, false);
    document.addEventListener("online", onOnline, false);
    document.addEventListener("offline", onOffline, false);
    document.addEventListener("backbutton", onBackKeyDown, false);

    $.resetList();
    $('#page-home').css({'background-color': '#FFFFFF'});
    $.freeze().show();
    $(window).scrollTop(0);
    $.contentPage().fitSize();
    $.device().android(function() {
        //$('.page-content').css({'overflow': 'auto'});
        $('.page').css({
            'overflow': 'auto',
            'height': $(window).height() - $('.title-top').height(),
            'float': 'left',
            'position': 'relative',
        });
    });



    $.googleMap();


    afterSync = function() {

        isOnDeviceReadyEventActive = 0;
        $.freeze().hide();
        setWidthNewsList();
        $('#page-home').css({'background-color': '#353535'});

        $('.news-list ul li a').bind('click', function() {
            var index = $(this).attr('data-index');
            var newsId = $(this).attr('data-id');
            window.location.hash = "newsId=" + newsId;
            historyPage = 'NEWS-DETAILS';

            var jqxhr = $.ajax({
                url: "news-details.html",
                data: {newsId: newsId},
            }).done(function(data) {
                var $pageCafeDetails = $('#page-cafe-details');
                $pageCafeDetails.html(data);
                $.contentPage().activePage(index);
            });
        });
        $('.cafe-list ul li a').bind('click', function() {
            var index = $(this).attr('data-index');
            var cafeId = $(this).attr('data-id');
            window.location.hash = "cafeId=" + cafeId;
            historyPage = 'CAFE-DETAILS';

            var jqxhr = $.ajax({
                url: "cafe-details.html",
                data: {cafeId: cafeId},
            }).done(function(data) {
                var $pageCafeDetails = $('#page-cafe-details');
                $pageCafeDetails.html(data);
                $.contentPage().activePage(index);
            });
        });
    };




    $.mobileSync({
        stateInternet: getStateInternet(),
        callback: function() {

            console.log('DEVICE READY: FUNCTION CALLBACK');
            var isCafeQuery = false;
            var isNewsQuery = false;

            // for query completed
            var tMobile = setInterval(function() {

                if ((isCafeQuery) && (isNewsQuery)) {
                    console.log('DEVICE READY: QUERY SUCCESS TRUE');
                    clearInterval(tMobile);
                    afterSync();
                } else {
                    //      console.log('DEVICE READY: QUERY SUCCESS FALSE');
                }
            }, 100);

            $.database({
                sql: {
                    data: ['SELECT * FROM cafe', [], function(tx, results) {
                            var len = results.rows.length;
                            var rows = results.rows;

                            for (var i = 0; i < len; i++) {
                                item = jsEncode(rows.item(i).data);
                                cafe = eachOne(item.cafe);

                                $.addCafeList({
                                    number: 0 + 1,
                                    url: "#cafe-details?id=" + cafe.Id,
                                    cafeId: cafe.Id,
                                    title: cafe.Title,
                                    secondTitle: cafe.Location,
                                    openTime: cafe["Dayofweek.Opentime"],
                                    closeTime: cafe["Dayofweek.Closetime"],
                                    thumb: getServerName() + cafe.Picture,
                                    curTime: cafe.Curtime,
                                    isShowCafeClosed: false,
                                });
                            }
                            $.sortCafeList().orderByClosed();
                            isCafeQuery = true;
                        }],
                }
            });
            // news query
            $.database({
                sql: {
                    data: ['SELECT * FROM news', [], function(tx, results) {
                            var len = results.rows.length;
                            var rows = results.rows;

                            for (var i = 0; i < len; i++) {
                                item = jsEncode(rows.item(i).data);
                                news = eachOne(item.news);
                                $.addNewsList({
                                    url: "#news-details?id=" + news.Id,
                                    newsId: news.Id,
                                    title: news.Title,
                                    detailsEn: news.Detailsen,
                                    thumb: getServerName() + news.Picture,
                                    lastUpdate: (news.Modifiedon.date).substr(0, 10),
                                });
                                ;
                            }
                            isNewsQuery = true;
                        }],
                }
            });

        }
    });


    $.desktopRenderer({
        callback: function() {
            afterSync();
            console.log('**** DESKTOP SYNC SUCCESS ****');
        }
    });


    $('.btn-back-icon').bind('click', function() {
        $('.btn-back-icon').hide();

        switch (historyPage) {
            case 'MAP-DETAILS':
                $('.me-icon-map').trigger('click');
                break;
            case 'CAFE-DETAILS':
                //window.location.reload();
                $('.me-icon-home').trigger('click');
                break;
            case 'NEWS-DETAILS':
                $('.me-icon-news').trigger('click');
                break;
            default:
                $('.btn-back-icon').show();
                break;
        }
    });
    $('.tab-menu ul li a, .btn-info-icon, .btn-cafe-details').bind('click', function() {
        $(window).scrollTop(0);
        $(this).addClass('selected');
        var index = $(this).attr('data-index');
        var title = $(this).attr('data-title');

        historyPage = title;
        //console.log(historyPage);

        if ((!($(this).hasClass('btn-info-icon'))) && (!($(this).hasClass('btn-cafe-details')))) {
            $('.title-fixed h1').html($(this).attr('data-title'));
            $('.tab-menu ul li a, .btn-info-icon, .btn-cafe-details').css({'background-position': '0 0'});
            $(this).css({'background-position': '0 -40px'});
        }

        $.contentPage().activePage(index);
        if (title === "MAP") {
            var $cafeMap = $("#map_canvas");

            $cafeMap.gmap('option', 'draggable', true);

            //
            $cafeMap.gmap("refresh");
            $cafeMap.gmap('option', 'zoom', 18);
        } else if (title === "NEWS") {

        }
    });
}


function isInternet() {

    var state = false;
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN] = false;
    states[Connection.ETHERNET] = true;
    states[Connection.WIFI] = true;
    states[Connection.CELL_2G] = true;
    states[Connection.CELL_3G] = true;
    states[Connection.CELL_4G] = true;
    states[Connection.NONE] = false;

    state = states[networkState];

    return state;
}

function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.NONE] = 'No network connection';

    connection = 'Connection type: ' + states[networkState];
    console.log(connection);
}

function onBackKeyDown() {
    navigator.notification.confirm(
            'Are you sure want to exit ?', // message
            onConfirm, // callback to invoke
            'Confirm', // title
            'No,Yes', // buttonLabels
            '' // defaultText
            );
}

function onConfirm(buttonIndex) {
    if (buttonIndex == 2) { //Validate against stored password
        navigator.app.exitApp();
    }
}
