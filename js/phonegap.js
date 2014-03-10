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
                'Please turn on Wi-Fi or 3G to use this App', // message
                onConnectionInternet, // callback to invoke
                'No Internet Connection', // title
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
                                    isClosed: cafe["Dayofweek.Isclose"],
                                    dayName: cafe["Dayofweek.Day"],
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
                                    shortDescription: news.Shortdescription,
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
