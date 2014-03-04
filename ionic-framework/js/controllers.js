angular.module('starter.controllers', ['google-maps'])

        .controller('CafeIndexCtrl', function($scope, CafeService) {

            CafeService.all().then(function(response) {

                $scope.rows = response.data;
                $scope.serverName = "http://www.coffee.wgolfw.com";



                $scope.isOpen = function(openTime, closeTime, curTime) {
                    var curTime = curTime;
                    var openTime = (openTime + ":00");
                    var closeTime = (closeTime + ":00");

                    var regExp = /(\d{1,2})\:(\d{1,2})\:(\d{1,2})/;

                    curTime = parseInt(curTime.replace(regExp, "$1$2$3"));
                    openTime = parseInt(openTime.replace(regExp, "$1$2$3"));
                    closeTime = parseInt(closeTime.replace(regExp, "$1$2$3"));

                    if ((curTime > openTime) && (curTime < closeTime)) {
                        return "OPEN";
                    } else {
                        return "CLOSED";
                    }
                };
            });



        })

        .controller('CafeDetailCtrl', function($scope, $stateParams, CafeService) {

            CafeService.get($stateParams.cafeId).then(function(response) {
                console.log(response.data);

                var cafeName = '';
                var latitude = null;
                var longitude = null;
                var picture = null;

                var cafeObj = [];
                angular.forEach(response.data.cafe, function(value, key) {
                    cafeName = value.Title;
                    latitude = value.Latitude;
                    longitude = value.Longitude;
                    picture = value.Picture;
                    this.push = value;

                }, cafeObj);



                $scope.convertDayName = function(day) {
                    
                    var name
                    switch (day) {
                        case 'm':
                            name = 'Mon';
                            break;
                        case 't' :
                            name = 'Tue';
                            break;
                        case 'w':
                            name = 'Wed';
                            break;
                        case 'th':
                            name = 'Thu';
                            break;
                        case 'f':
                            name = 'Fri';
                            break;
                        case 'sa':
                            name = "Sat";
                            break; 
                        case 's':
                            name = 'Sun';
                            break;
                        default:
                            name = 'Unknow';
                    }
                    return name + '.';
                };

                $scope.pet = response.data;
                $scope.serverName = "http://www.coffee.wgolfw.com";
                $scope.cafeName = cafeName;
                $scope.map = {
                    center: {
                        latitude: latitude,
                        longitude: longitude,
                    },
                    zoom: 18,
                    showTraffic: true,
                    showBicycling: false,
                    showWeather: false,
                    showHeat: false,
                };



                $scope.markers = {
                    Marker: {
                        "icon": $scope.serverName + picture,
                        "latitude": latitude,
                        "longitude": longitude,
                        "showWindow": true,
                        "title": cafeName
                    },
                }

            });

        })

        .controller('NewsListCtrl', function($scope, NewsService) {


            NewsService.all().then(function(response) {
                $scope.rows = response.data;
                $scope.serverName = "http://www.coffee.wgolfw.com";

            });


        })

        .controller('MapCtrl', function($scope) {

            $scope.map = {
                center: {
                    latitude: 45,
                    longitude: -73
                },
                zoom: 3,
                showTraffic: false,
                showBicycling: false,
                showWeather: false,
                showHeat: false,
                options: {
                    streetViewControl: false,
                    panControl: false,
                    maxZoom: 20,
                    minZoom: 3
                },
                bounds: {},
                markers: [
                    {
                        latitude: 45,
                        longitude: -74,
                        showWindow: true,
                        title: 'Marker 2'
                    },
                    {
                        latitude: 15,
                        longitude: 30,
                        showWindow: false,
                        title: 'Marker 2'
                    },
                    {
                        icon: 'plane.png',
                        latitude: 37,
                        longitude: -122,
                        showWindow: false,
                        title: 'Plane'
                    }
                ],
                markers2: [
                    {
                        latitude: 46,
                        longitude: -77,
                        showWindow: false,
                        title: '[46,-77]'
                    },
                    {
                        latitude: 33,
                        longitude: -77,
                        showWindow: false,
                        title: '[33,-77]'
                    },
                    {
                        icon: 'plane.png',
                        latitude: 35,
                        longitude: -125,
                        showWindow: false,
                        title: '[35,-125]'
                    }
                ],
                mexiMarkers: [
                    {
                        latitude: 29.302567,
                        longitude: -106.248779
                    },
                    {
                        latitude: 30.369913,
                        longitude: -109.434814
                    },
                    {
                        latitude: 26.739478,
                        longitude: -108.61084
                    }
                ],
                doUgly: true, //great name :)
                clickedMarker: {
                    title: 'You clicked here',
                    latitude: null,
                    longitude: null
                },
            };

            /*
             $scope.markers = {
             Marker: {
             "icon": "http://www.coffee.wgolfw.com/images/cafe/logo-26/20140128150416.png",
             "latitude": 45,
             "longitude": -73,
             "showWindow": true,
             "title": "Plaffffne"
             },
             Marker2: {
             "icon": "http://www.coffee.wgolfw.com/images/cafe/logo-26/20140128150416.png",
             "latitude": 45.1,
             "longitude": -73,
             "showWindow": true,
             "title": "Plane"
             },
             }
             */
        })
        ;



 