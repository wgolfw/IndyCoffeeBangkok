angular.module('starter', ['ionic', 'starter.services', 'starter.controllers'])


        .config(function($stateProvider, $urlRouterProvider) {

            // Ionic uses AngularUI Router which uses the concept of states
            // Learn more here: https://github.com/angular-ui/ui-router
            // Set up the various states which the app can be in.
            // Each state's controller can be found in controllers.js
            $stateProvider

                    // setup an abstract state for the tabs directive
                    .state('tab', {
                        url: "/tab",
                        abstract: true,
                        templateUrl: "templates/tabs.html"
                    })

                    // the pet tab has its own child nav-view and history
                    .state('tab.pet-index', {
                        url: '/cafes',
                        views: {
                            'cafes-tab': {
                                templateUrl: 'templates/cafes.html',
                                controller: 'CafeIndexCtrl'
                            }
                        }
                    })

                    .state('tab.map', {
                        url: '/map',
                        views: {
                            'map-tab': {
                                templateUrl: 'templates/map.html',
                                controller: 'MapCtrl'
                            }
                        }
                    })

                    .state('tab.pet-detail', {
                        url: '/cafe/:cafeId',
                        views: {
                            'cafes-tab': {
                                templateUrl: 'templates/cafe-detail.html',
                                controller: 'CafeDetailCtrl'
                            }
                        }
                    })

                    .state('tab.news', {
                        url: '/news',
                        views: {
                            'news-tab': {
                                templateUrl: 'templates/news.html',
                                controller: 'NewsListCtrl',
                            }
                        }
                    })

                    .state('tab.about', {
                        url: '/about',
                        views: {
                            'about-tab': {
                                templateUrl: 'templates/about.html'
                            }
                        }
                    });

            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/tab/cafes');

        });

