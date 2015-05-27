/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var homeControllers = angular.module('dashboard.controllers', ['angular-jqcloud']);
homeControllers.controller('userController',['$rootScope', '$scope', 'apiService',
    function ($rootScope, $scope, apiService){

        $scope.username = null;
        var getUser = apiService.getUser()
            .success(function(response){

                $scope.username = response.replace(/['"]+/g, '');
            })
            .error(function(data,status){

            });
    }]);

homeControllers.controller('SummaryByCountryController', ['$rootScope', '$scope', '$q', 'apiService',
    function ($rootScope, $scope, $q, apiService) {
        var summaryData = null;
        var summerYears = {2000: 0, 2004: 0, 2008: 0, 2012: 0};

        $scope.getSummaryByCountry = apiService.getSummaryByCountry()
            .success(function (response) {

                summaryData = response;
            }).error(function (data, status) {
                console.log('Inside getSummaryByCountry, status : Error ');
                console.log('data :' + data);
                console.log('status :' + status);
            });

        $q.all([$scope.getSummaryByCountry]).then(function (response) {
            var formatDate = function (unformatedDate) {
                var unfDate = new Date(unformatedDate);
                var dd = unfDate.getDate();
                var mm = unfDate.getMonth() + 1;
                var yyyy = unfDate.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }
                var fDate = yyyy + '-' + mm + '-' + dd;
                return fDate;
            };

            console.log(response);
            var summaryData = [];
            var summaryData_summer = [];
            var summaryData_winter = [];
            var responseData = response[0].data;
            var lookupCountries = {}, count = 0;
            var lookupYears = {};
            var iter = 0, iter_winter = 0, iter_summer = 0;
            for (var index in responseData) {
                var item = {};
                var year = responseData[index].year;
                var date1 = new Date(year, 0, 1);
                date2 = formatDate(date1);
                var country = responseData[index].country;
                count = responseData[index].total_perYr;

                if (!(year in lookupYears )) {
                    lookupYears[year] = 1;
                    summaryData[iter] = {};
                    summaryData[iter].year = date2;
                    //   summaryData[iter]['year'] = year;
                    summaryData[iter][country] = responseData[index].total_perYr;
                    iter++;
                    if (!(year in summerYears)) {
                        summaryData_winter[iter_winter] = {};
                        summaryData_winter[iter_winter].year = date2;
                        summaryData_winter[iter_winter][country] = responseData[index].total_perYr;
                        iter_winter++;
                    }
                    else {
                        summaryData_summer[iter_summer] = {};
                        summaryData_summer[iter_summer].year = date2;
                        summaryData_summer[iter_summer][country] = responseData[index].total_perYr;
                        iter_summer++;
                    }
                }
                if (!(responseData[index].country in lookupCountries)) {
                    lookupCountries[(responseData[index].country)] = count;
                }
                else {
                    lookupCountries[(responseData[index].country)] = lookupCountries[(responseData[index].country)] + count;
                }
                for (var instance = 0; instance < summaryData.length; instance++) {
                    if (summaryData[instance].year === date2) {
                        summaryData[instance][country] = responseData[index].total_perYr;
                        break;
                    }
                }
                for (var instance_w = 0; instance_w < summaryData_winter.length; instance_w++) {
                    if (summaryData_winter[instance_w].year === date2) {
                        summaryData_winter[instance_w][country] = responseData[index].total_perYr;
                        break;
                    }
                }
                for (var instance_s = 0; instance_s < summaryData_summer.length; instance_s++) {

                    if (summaryData_summer[instance_s].year === date2) {
                        summaryData_summer[instance_s][country] = responseData[index].total_perYr;
                        break;
                    }
                }
            }
            $scope.lookupCountries = lookupCountries;
            var lookup_countries_list = Object.keys(lookupCountries).map(function (value) {
                return value;
            });
            console.log("lookupCountries :");
            console.log(lookupCountries);
            if (lookup_countries_list.length > 10) {
                lookup_countries_list.length = 10;
            }
            console.log("lookup_countries_list :" + lookup_countries_list);
            $scope.summaryData = summaryData;
            $scope.summaryData_summer = summaryData_summer;
            $scope.summaryData_winter = summaryData_winter;
            console.log($scope.summaryData);
            $scope.xkey = 'year';
            $scope.ykeys = lookup_countries_list;
            $scope.labels = lookup_countries_list;
            angular.element("#summarychart1").empty();

            var generateChart = function (bindDiv, summaryData) {
                var chart = c3.generate({
                    bindto: '' + bindDiv,
                    padding: {top: 10, right: 50, bottom: 10},
                    data: {
                        json: summaryData,
                        keys: {
                            x: 'year',
                            value: $scope.ykeys
                        },
                        type: 'spline'
                    },
                    zoom: {enabled: true},
                    axis: {
                        x: {
                            type: 'timeseries',
                            label: 'Year',
                            tick: {
                                format: d3.time.format("%Y")
                                //format: '%Y' // format string is also available for timeseries data
                            }
                        },
                        y: {
                            label: {// ADD
                                text: 'Count'
                            },
                            tick: {
                                format: d3.format("s")
                            }
                        }
                    }
                });
            };
            generateChart('#summarychart1', $scope.summaryData);
            generateChart('#summarychart2', $scope.summaryData_winter);
            generateChart('#summarychart3', $scope.summaryData_summer);

            var wordCloud = [];
            for (var text in lookupCountries) {
        //        console.log("text : " + text);
        //        console.log(" lookupCountries[text] :" + lookupCountries[text]);
                var item2 = {};
                item2.text = text;
                item2.weight = lookupCountries[text];
                wordCloud.push(item2);
            }
            $scope.wordCloud = wordCloud;
            $scope.countQueryFilter = function(wordCloud){
                if(isNaN($scope.countQuery))
                    return true;
                return wordCloud.weight >= $scope.countQuery;
            };
        });
    }]);

