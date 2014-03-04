
angular.module('starter.services', [])


        .factory('CafeService', function($http) {

            return {
                all: function() {

                    var cafes = $http({method: 'GET', url: 'http://www.coffee.wgolfw.com/get/service/cafe-sync'});
                    return cafes;
                },
                get: function(cafeId) {

                    var cafeDetail = $http({method: 'GET', url: 'http://www.coffee.wgolfw.com/get/service/cafe-detail/' + cafeId});
                    return cafeDetail;
                }
            }
        })
        .factory('NewsService', function($http) {
           return {
                all: function() {

                    var news = $http({method: 'GET', url: 'http://www.coffee.wgolfw.com/get/service/news-sync'});
                    return news;
                },
                get: function(newsId) {

                    var newsDetail = $http({method: 'GET', url: 'http://www.coffee.wgolfw.com/get/service/news-detail/' + newsId});
                    return newsDetail;
                }
            }
        });
