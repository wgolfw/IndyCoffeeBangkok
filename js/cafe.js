var storage = window.localStorage;
var lastSyncDateCompleted = storage.getItem("lastSyncDateCompleted");
$.freeze = function() {
    var speed = 500;

    return {
        show: function() {
            //$('body').css({'overflow': 'hidden !important'});
            var opts = {
                lines: 9, // The number of lines to draw
                length: 3, // The length of each line
                width: 2, // The line thickness
                radius: 3, // The radius of the inner circle
                corners: 1, // Corner roundness (0..1)
                rotate: 0, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                color: '#000', // #rgb or #rrggbb or array of colors
                speed: 1, // Rounds per second
                trail: 60, // Afterglow percentage
                shadow: false, // Whether to render a shadow
                hwaccel: false, // Whether to use hardware acceleration
                className: 'spinner', // The CSS class to assign to the spinner
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                top: 'auto', // Top position relative to parent in px
                left: 'auto' // Left position relative to parent in px
            };

            var $load = $('<div />', {'class': 'load'});
            var scrollTop = $(window).scrollTop();
            //console.log('Scroll top: ' + scrollTop);
            $load.css({'margin-top': scrollTop});

            $load.prependTo('body');

            var $spin = $('<div/>', {
                id: 'spin',
            }).appendTo($load);

            var $freeze = $('<div/>', {
                'class': 'freeze',
            }).appendTo($load);

            var target = document.getElementById('spin');
            var spinner = new Spinner(opts).spin(target);
            //$('body').css({'overflow': 'hidden'});

            $load.fadeIn(speed);

        },
        hide: function() {
            var $load = $('body').find('.load');
            $load.fadeOut(speed, function() {
                $load.remove();
                $('body').css({'overflow': 'auto'});
            });
        }
    }

};
$.contentPage = function(options) {

    var opts = $.extend({
        id: $(".page"),
        selector: $('div[id^="page-"]'),
        swipe: false,
        callback: function() {
        },
    }, options);


    var objH = new Object();
    objH.window = $(window).height();
    objH.titleTop = $('.title-top').height();
    objH.tabMenu = $('.tab-menu').height();
    var h = objH.window - objH.titleTop - objH.tabMenu + 2;
    var w = $(window).width();

    var $page = opts.selector;

    return {
        fitSize: function() {
            // opts.id.css({'height': h});
            $page.css({
                 'height': h,
                // 'width': w,
                //'margin-bottom': objH.tabMenu,
            });
            var count = 0;
            $page.find('> p').remove();
            $page.each(function() {
                //  $(this).prepend('<p>page' + (++count) + '</p>');
            });
            //$page.css({'display': 'block'});
        },
        getHeight: function() {
            return h;
        },
        activePage: function(index) {
            $page.css({'z-index': 0, 'display': 'none'});
            var idName = $page.attr('id');
            $($page[index]).css({'z-index': 9, 'display': 'block'});
        }
    }
};

$.currentLocation = function() {
    var $map = $('#map_canvas');
    $map.gmap('destroy');
    $map.gmap();

};

$.getDirectionMap = function(origin, destination, callback, $map) {
    $map.gmap('displayDirections', {
        'origin': origin,
        'destination': destination,
        'travelMode': google.maps.DirectionsTravelMode.DRIVING}, {
        'panel': document.getElementById('map_panel')
    }, function(result, status) {
        if (status === 'OK') {
            if (callback != null) {
                $('.no-drag').hide();
                callback();
            }
        } else {

        }
    });
};

$.googleMap = function() {

    if (getStateInternet() === false) {
        return;
    }

    var $cafeMap = $('#map_canvas');
    $cafeMap.css({'visibility': 'hidden'});


    $cafeMap.gmap({
        'zoomControl': false,
        'mapTypeControl': false,
        'navigationControl': false,
        'streetViewControl': false,
        'callback': function() {


            var h = $('#page-map').height();
            $cafeMap.height($.contentPage().getHeight());
            $cafeMap.css({'visibility': 'visible'});

            $('.btn-location').bind('click', function() {
                $.currentLocation();
            });

            //$('#map_canvas').gmap('option', 'zoom', 13);


        }
    }).bind('init', function() {


        var urlJson = getServerName() + 'get/service/cafe-coordinates';
        $.getJSON(urlJson, function(data) {
            var iconPin = "images/icons/marker.png";

            $.each(data.markers, function(i, marker) {
                $cafeMap.gmap('addMarker', {
                    'position': new google.maps.LatLng(marker.latitude, marker.longitude),
                    'draggable': false,
                    'bounds': false,
                    'icon': iconPin,
                }).click(function() {

                    var $a = $('<a/>', {
                        'class': 'btn-map-cafe-details',
                        'data-index': '26',
                        'style': 'color:#000;text-decoration:none;',
                        'href': 'javascript:void(0);'
                    });
                    aTagOpen = "<a class='btn-map-cafe-details' data-index='" + marker.id + "' style='color:#000;text-decoration:none;' href='#map&cafeId=" + marker.id + "'>";
                    aTagClose = "</a>";
                    $cafeMap.gmap('openInfoWindow', {'content': aTagOpen + marker.content + aTagClose}, this);
                });
            });



            if (isMobile()) {
                var onSuccess = function(position) {
                    lati = position.coords.latitude;
                    long = position.coords.longitude;

                    var clientPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    $cafeMap.gmap('addMarker', {
                        'position': clientPosition,
                        'bounds': true,
                        'draggable': false,
                    }).click(function() {
                        $cafeMap.gmap('openInfoWindow', {'content': '<span style="font-family:bebas;">I\'m&nbsp;&nbsp;&nbsp;here!</span>'}, this);
                    });
                };

                var onError = function(error) {
                };
                navigator.geolocation.getCurrentPosition(onSuccess, onError);
            } else {
                $cafeMap.gmap('getCurrentPosition', function(position, status) {
                    if (status === 'OK') {
                        var clientPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                        $cafeMap.gmap('addMarker', {
                            'position': clientPosition,
                            'bounds': true,
                            'draggable': false,
                        }).click(function() {
                            $cafeMap.gmap('openInfoWindow', {'content': '<span style="font-family:bebas;">I\'m&nbsp;&nbsp;&nbsp;here!</span>'}, this);
                        });
                    }
                });

            }
        });

//        $cafeMap.gmap('option', 'draggable', true);
//        $cafeMap.gmap('option', 'scrollwheel', true);
//        $cafeMap.gmap('option', 'zoom', 13);
//        $cafeMap.gmap('refresh');
    });

}
$.device = function(callback) {

    var ua = navigator.userAgent;
    return {
        android: function(callback) {
            if (ua.match(/Android/i)) {
                callback();
            }
        },
        ios: function(callback) {
            if (ua.match(/iPhone/i) || ua.match(/iPad/i) || ua.match(/iPod/i)) {
                callback();
            }
        }
    }
}

$.getService = function(options) {
    var opts = $.extend({
        url: "#",
        callback: function() {
        }
    }, options);

    $.getJSON(opts.url, function(data) {
        opts.callback(data);
    });
}

$.resetList = function(options) {
    $('.cafe-list ul').empty();
    $('.news-list ul').empty();
};

var cafeClosed = new Array();
$.sortCafeList = function() {

    return {
        orderByClosed: function() {

            for (i = 0; i < cafeClosed.length; i++) {
                item = cafeClosed[i];
                //console.log(item);
                $.addCafeList({
                    number: item.number,
                    url: item.url,
                    cafeId: item.cafeId,
                    title: item.title,
                    secondTitle: item.secondTitle,
                    openTime: item.openTime,
                    closeTime: item.closeTime,
                    thumb: item.thumb,
                    curTime: item.curTime,
                    isShowCafeClosed: true,
                });
            }
            cafeClosed =  new Array();
        },
    };
};
$.addCafeList = function(options) {
    var $cafeList = $('.cafe-list ul');

    var opts = $.extend({
        number: null,
        url: "javascript:void(0)",
        cafeId: "0",
        title: "Title",
        secondTitle: "Location",
        openTime: "00:00",
        closeTime: "00:00",
        thumb: "#",
        curTime: "00:00",
        dayName: null,
        isShowCafeClosed: true,
        isClosed: true,
    }, options);

    var curTime = (opts.curTime);
    var openTime = (opts.openTime + ":00");
    var closeTime = (opts.closeTime + ":00");

    var regExp = /(\d{1,2})\:(\d{1,2})\:(\d{1,2})/;

    curTime = parseInt(curTime.replace(regExp, "$1$2$3"));
    openTime = parseInt(openTime.replace(regExp, "$1$2$3"));
    closeTime = parseInt(closeTime.replace(regExp, "$1$2$3"));



    var dayName = "";
    switch (opts.dayName) {
        case "m":
            dayName = "Mon";
            break;
        case "t":
            dayName = "Tue";
            break;
        case "w":
            dayName = "Wed";
            break;
        case "th":
            dayName = "Thu";
            break;
        case "f":
            dayName = "Fri";
            break;
        case "sa":
            dayName = "Sat";
            break;
        case "s":
            dayName = "Sun";
            break;
    }

    var openHour = null;


    if ((curTime > openTime) && (curTime < closeTime)) {
        classTime = 'time-open';
        statusTime = 'OPEN';


        if (parseInt(opts.isClosed) === 1) {
            opts.openTime = "Closed " + dayName + ".";
            opts.closeTime = "";

            // openHour = "Closed " + dayName + ".";
            classTime = 'time-closed';
            statusTime = 'CLOSED';
            cafeClosed.push(opts);
            return;
        }



    } else {
        classTime = 'time-closed';
        statusTime = 'CLOSED';
        if (parseInt(opts.isClosed) === 1) {
            opts.openTime = "Closed " + dayName + ".";
            opts.closeTime = "";
            //openHour = "Closed " + dayName + ".";
        }
        if (!opts.isShowCafeClosed) {
            cafeClosed.push(opts);
            return;
        }

    }


    openHour = (opts.closeTime === "") ? opts.openTime : opts.openTime + "-" + opts.closeTime;

    var $li = $('<li />', {});

    var $a = $('<a />', {
        'href': "javascript:void(0);", //pts.url,
        'class': 'btn-cafe-details',
        'data-id': opts.cafeId,
        'data-index': 5,
    });

    var $divDataDetail = $('<div />', {
        'class': 'data-detail pull-left'
    });

    var $h1Title = $('<h1/>', {
        'html': opts.title
    }).appendTo($divDataDetail);

    var $pFirstDetail = $('<p />', {
        'class': "first-detail",
        'html': opts.secondTitle,
    }).appendTo($divDataDetail);

    var $pTimeDetail = $('<p />', {
        'class': "time-detail",
        'html': "<span class='day-time'>" + openHour + "</span> <span class='" + classTime + "'>" + statusTime + "</span>"
    }).appendTo($divDataDetail);

    var $divDataImage = $('<div />', {
        'class': 'data-image pull-right'
    });

    var $imgThumb = $('<img />', {
        'class': "thumbnail thumb-list",
        'src': opts.thumb,
        'style': 'display:none;'
    }).appendTo($divDataImage);
    $imgThumb.load(function(){
       $(this).show();
    });
    $divDataDetail.appendTo($a);
    $divDataImage.appendTo($a);
    $a.appendTo($li);
    $cafeList.append($li);



}
$.addNewsList = function(options) {
    var $newsList = $('.news-list ul');
    var opts = $.extend({
        url: "javascript:void(0)",
        newsId: null,
        title: "Title",
        detailsEn: null,
        thumb: "#",
        lastUpdate: null,
        shortDescription: null,
    }, options);

    var $li = $('<li />', {});

    var $a = $('<a />', {
        'href': "javascript:void(0);", //pts.url,
        'class': 'btn-cafe-details',
        'data-id': opts.newsId,
        'data-index': "5"
    });

    var $divDataDetail = $('<div />', {
        'class': 'data-detail'
    });

    var $imgThumb = $('<img />', {
        'class': "thumb-list thumb-news",
        'src': opts.thumb,
        //'style': 'width:156px;height:156px;'
    }).appendTo($divDataDetail);


    var $divDesc = $('<div />', {
        'class': 'desc'
    });

    var $h1Title = $('<h1 />', {
        html: opts.title
    }).appendTo($divDesc);
 
    var $pDetail = $('<p/>', {
        'class': 'news-details',
        'html': opts.shortDescription,
    }).appendTo($divDesc);

    $divDesc.appendTo($divDataDetail);

    $divDataDetail.appendTo($a);
    $a.appendTo($li);
    $newsList.append($li);
};


var db = null;
var db_name = null;
$.database = function(options) {


    var opts = $.extend({
        name: null,
        version: "1.0",
        displayName: "webSqlDatabaseApp",
        size: "1000000",
        sql: null,
        callError: function(err) {
            //console.log(err);
        },
        callSuccess: function() {
            //console.log('Success!');
        },
    }, options);



    var sql = null;

    create = function() {
        db = window.openDatabase(opts.name, opts.version, opts.displayName, opts.size);
    };

    sqlCommand = function(tx) {
        $.each(opts.sql, function(key, item) {
            switch (item.length) {
                case 1:
                    tx.executeSql(item[0]);
                    break;
                case 2:
                    item[1];
                    tx.executeSql(item[0], item[1]);
                    break;
                case 3:
                    tx.executeSql(item[0], item[1], item[2]);
                    break;
            }

        });
    }

    transaction = function() {
        db.transaction(sqlCommand, opts.callError, opts.callSuccess);
    };

    if (opts.name !== null) {
        create();
    }


    if (opts.sql !== null) {
        transaction();
    }

    return {
        open: function(databaseName) {
            db_name = databaseName;
            db = window.openDatabase(db_name, opts.version, opts.displayName, opts.size);
            return db;
        },
        create: function(tableName, callSuccess, callError) {
            function populateDB(tx) {
                $.each(tableName, function(key, item) {

                    tx.executeSql('CREATE TABLE IF NOT EXISTS ' + item + '(id unique, data)');
                    //tx.executeSql('INSERT INTO ' + item + ' (id, data) VALUES (1, "Fss33irssst row")');
                });
            }
            db.transaction(populateDB, callError, callSuccess);
        },
        drop: function(tableName, callSuccess, callError) {
            function populateDB(tx) {
                $.each(tableName, function(key, item) {
                    tx.executeSql('DROP TABLE IF EXISTS ' + item);
                });
            }
            db.transaction(populateDB, callError, callSuccess);
        },
    }
}


$.mobileSync = function(options) {

    var isCafeSync = false;
    var isNewsSync = false;

    var opts = $.extend({
        stateInternet: true,
        callback: function() {
        },
    }, options);

    //opts.stateInternet = false;
    /**** load data old sync ****/
    if ((lastSyncDateCompleted !== null) && (opts.stateInternet === false)) {
        //console.log('Load data old');
        $.database().open("ICB");
        opts.callback();
        return false;
    }

    if ((lastSyncDateCompleted === null) && (opts.stateInternet === false)) {
        return false;
    }


    if ((opts.stateInternet) && isMobile()) {
        //if ((opts.stateInternet)) {
        // callback
        var t = setInterval(function() {
            if ((isCafeSync) && (isNewsSync)) {
                clearInterval(t);

                var curDatetime = new Date();
                // curDatetime.format("dd/M/yy h:mm tt");
                storage.setItem("lastSyncDateCompleted", curDatetime);
                opts.callback();
            }
        }, 100);

        var tableName = ['cafe', 'news'];
        var db = $.database().open("ICB");


        $.database().drop(tableName);
        $.database().create(tableName);

        // SYNC CAFE
        $.getService({
            url: getServerName() + "get/service/cafe-sync",
            callback: function(data) {

                var counter = 0;
                $.each(data, function(key, row) {
                    cafe = eachOne(row.cafe);

                    jDataDecode = jsDecode(row);
                    $.database({
                        sql: {
                            data: ['INSERT INTO cafe (id, data) VALUES (' + cafe.Id + ', "' + jDataDecode + '")'],
                        },
                    });
                });

                isCafeSync = true;
            },
        });

        // SYNC NEWS
        $.getService({
            url: getServerName() + "get/service/news-sync",
            callback: function(data) {

                var counter = 0;
                $.each(data, function(key, row) {
                    news = eachOne(row.news);
                    jDataDecode = jsDecode(row);
                    $.database({
                        sql: {
                            data: ['INSERT INTO news (id, data) VALUES (' + news.Id + ', "' + jDataDecode + '")'],
                        },
                    });
                });

                isNewsSync = true;
            },
        });
    }
}

$.desktopRenderer = function(options) {
    if (isMobile()) {
        return;
    }

    var isCafeSync = false;
    var isNewsSync = false;

    var opts = $.extend({
        callback: function() {
        },
    }, options);


    //console.log('/**** DESKTOP ****/');

    // callback
    var t = setInterval(function() {
        if ((isCafeSync) && (isNewsSync)) {
            clearInterval(t);
            opts.callback();
        }
    }, 100);


    // GET DATA CAFE LIST
    $.getService({
        url: getServerName() + "get/service/cafe-list",
        callback: function(data) {
            var counter = 0;
            $.each(data, function(key, item) {
                $.addCafeList({
                    number: ++counter,
                    url: "#cafe-details?id=" + item.Id,
                    cafeId: item.Id,
                    title: item.Title,
                    secondTitle: item.Location,
                    openTime: item["Dayofweek.Opentime"],
                    closeTime: item["Dayofweek.Closetime"],
                    thumb: getServerName() + item.Picture,
                    curTime: item.Curtime,
                    isShowCafeClosed: false,
                    isClosed: item["Dayofweek.Isclose"],
                    dayName: item["Dayofweek.Day"],
                });

             
            });
            $.sortCafeList().orderByClosed();
            isCafeSync = true;
        }
    });

    // GET DATA NEWS LIST
    $.getService({
        url: getServerName() + "get/service/news-list",
        callback: function(data) {
            $.each(data, function(key, item) {
                $.addNewsList({
                    url: "#news-details?id=" + item.Id,
                    newsId: item.Id,
                    title: item.Title,
                    detailsEn: item.Detailsen,
                    thumb: getServerName() + item.Picture,
                    shortDescription: item.Shortdescription,
                    lastUpdate: (item.Modifiedon.date).substr(0, 10),
                });
            });
            isNewsSync = true;
        }
    });



}