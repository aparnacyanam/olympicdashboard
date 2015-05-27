/**
 * Created by shiva on 2/25/2015.
 */
var playerControllers = angular.module('player.controllers', []);
playerControllers.controller('countrySelectController2', ['$rootScope', '$scope', '$q', 'apiService',
    'filterEventBroadcastServices', function ($rootScope, $scope, $q, apiService, filterEventBroadcastServices) {

        $rootScope.countrySelectedResolve = $q.defer();
        apiService.getCountries()
            .success(function (response) {
                var countries = [];
                for (var country in response) {
                    var item = {};
                    item.label = 'country';
                    item.value = response[country].country;
                    countries.push(item);
                }
                $scope.countries = countries;
            }).error(function (data, status) {
                console.log('Inside getCountries, status : Error ');
                console.log('data :' + data);
                console.log('status :' + status);
            });

        $scope.$watch("countrySelected2", function (newValue, oldValue) {
            if (newValue === null && newValue === undefined) {
                //updateCountry(newValue);.
                //    $scope.countrySelected = 'United States'
            }
            if (newValue) {
                $rootScope.countrySelected2 = angular.copy($scope.countrySelected2.value);
                ($rootScope.countrySelectedResolve).resolve($scope.countrySelected2.value);
                console.log('new countrySelected : ' + $rootScope.countrySelected2);
                //   filterEventBroadcastServices.changeCountry();
            }
        });

        //var updateCountry = function (newCountry) {
        //    $rootScope.countrySelected = angular.copy(newCountry);
        //}

    }]);

playerControllers.controller('playerSelectController', ['$rootScope', '$scope', '$q', 'apiService',
    'filterEventBroadcastServices', function ($rootScope, $scope, $q, apiService, filterEventBroadcastServices) {

        $rootScope.$watch("countrySelected2", function (newValue, oldValue) {
            console.log("In playerSelectController : countrySelected2 " + $rootScope.countrySelected2);
            console.log("In playerSelectController : newValue " + newValue);
            if (newValue) {
                updatePlayerList(newValue);
            }
        });

        //var countryResolved = $q.all([($rootScope.countrySelectedResolve).promise]);
        //countryResolved.then(function (data) {
        //    console.log('$rootScope.countrySelected2 :' + $rootScope.countrySelected2);
        //    console.log('$rootScope.countrySelected2 resolved data :' + data );
        //    updatePlayerList(data);
        //});

        var updatePlayerList = function (countrySelected2) {
            apiService.getPlayers(countrySelected2)
                .success(function (response) {
                    var players = [];
                    for (var index in response) {
                        var item = {};
                        item.label = 'player';
                        item.PlayerName = response[index].player;
                        item.category = response[index].category;
                        players.push(item);
                    }
                    $scope.players = players;
                }).error(function (data, status) {
                    console.log('Inside getPlayers, status : Error ');
                    console.log('data :' + data);
                    console.log('status :' + status);
                });

            $scope.$watch("playerSelected", function (newValue, oldValue) {
                if (newValue === null && newValue === undefined) {
                    //updateCountry(newValue);.
                    //    $scope.countrySelected = 'United States'
                }
                if (newValue) {
                    $rootScope.playerSelected = angular.copy($scope.playerSelected.PlayerName);
                    console.log('new playerSelected : ' + newValue.PlayerName);
                    console.log('new playerSelected - $rootScope.playerSelected ' + $rootScope.playerSelected);
                    //   filterEventBroadcastServices.changeCountry();
                }
            });
        };
    }]);

playerControllers.controller('playerStatsController', ['$rootScope', '$scope', '$q', 'apiService',
    'filterEventBroadcastServices', function ($rootScope, $scope, $q, apiService, filterEventBroadcastServices) {

        console.log(" In playerStatsController ..... ");
        $scope.displayStats = true;
        $rootScope.$watch("playerSelected", function (newValue, oldValue) {
            if (newValue) {
                console.log(" In playerStatsController - playerSelected :" + newValue);
                updateData(newValue);
            }
        });

        var updateData = function (player) {
            var medalCountsResolve = $q.defer();
            apiService.getPlayerMedalCount(player)
                .success(function (response) {
                    $scope.displayStats = true;
                    medalCountsResolve.resolve(response);
                    console.log(response);
                    var result = response;
                    var medalCounts = [];
                    var morrisItem = {};

                    morrisItem.label = 'gold';
                    morrisItem.value = result[0].gold;
                    medalCounts.push(morrisItem);

                    morrisItem = {};
                    morrisItem.label = 'silver';
                    morrisItem.value = result[0].silver;
                    medalCounts.push(morrisItem);

                    morrisItem = {};
                    morrisItem.label = 'bronze';
                    morrisItem.value = result[0].bronze;
                    medalCounts.push(morrisItem);

                    $scope.medalCounts = medalCounts;


                    angular.element("#playermedalstats").empty();

                    if ($('#playermedalstats').length) {

                        Morris.Donut({
                            element: 'playermedalstats',
                            data: $scope.medalCounts,
                            hideHover: 'auto',
                            colors: ['#ffaa00', '#C0C0C0', '#d66932']
                        });
                    }
                }).error(function (data, status) {
                    console.log('Inside getPlayerMedalCount, status : Error ');
                    console.log('data :' + data);
                    console.log('status :' + status);
                });

            apiService.getPlayerInfo(player)
                .success(function (response) {
                    $scope.playerinfo = response;
                    console.log("playerinfo :");
                    console.log($scope.playerinfo);
                }).error(function (data, status) {
                    console.log('Inside getPlayerInfo, status : Error ');
                    console.log('data :' + data);
                    console.log('status :' + status);
                });

        };


    }]);