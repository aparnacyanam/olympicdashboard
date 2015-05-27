/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('olympicsApp', ['ngRoute', 'olympicsApi','broadcastServices', 'olympic.directives','olympic.MorrisDirectives',
    'country.controllers','dashboard.controllers','geo.controllers','player.controllers'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: '../../web/views/home.html'
            })
            .when('/geo', {
                templateUrl: '../../web/views/geo.html'
            })
            .when('/country', {
                templateUrl: '../../web/views/country.html'
            })
            .when('/player', {
                templateUrl: '../../web/views/player.html'
            })
            .when('/login', {
                templateUrl: '../login.html'
            })
            .otherwise({redirectTo: '/home'});
    }]);
