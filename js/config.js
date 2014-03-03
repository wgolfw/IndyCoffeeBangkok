function isMobile() {
    v = false;

    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i) || navigator.userAgent.match(/Opera Mini/i) || navigator.userAgent.match(/IEMobile/i)) {
        v = true;
    }

    return v;
}

function getServerName() {
    var server = "http://www.coffee.wgolfw.com/";
    var local = "http://www.cherry.dev/";

    if (isMobile()) {
          local = server;
    }
    return local;
}

function getStateInternet() {

    if (isMobile()) {
        var networkState = navigator.connection.type;
        isOnline = (networkState == Connection.NONE) ? false : true;
    } else {
        isOnline = window.navigator.onLine;
    }

    return isOnline;
}

function getHash() {
    var currentPath = window.location.href;
    return currentPath.substring(currentPath.indexOf('#') + 1);
}

function gotoIndex() {
    var currentPath = window.location.href;
    var isHash = currentPath.search("#");

    if (isHash !== -1) {
        window.location = "index.html";
    }
}