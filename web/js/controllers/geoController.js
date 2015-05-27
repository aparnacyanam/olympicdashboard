/**
 * Created by shiva on 2/23/2015.
 */
var GeoControllers = angular.module('geo.controllers', ['dashboard.controllers']);
GeoControllers.run(function ($rootScope, $q, apiService) {
    apiService.getYears()
        .success(function (response) {
            var years = [];
            for (var year in response) {
                var item = {};
            //    item['label'] = 'year';
            //    item['value'] = response[year].year;
                item.label = 'year';
                item.value = response[year].year;
                years.push(item);
            }
            $rootScope.years = years;
            console.log("getYears() : " + response);
            console.log(response);

        }).error(function (data, status) {
            console.log('Inside getYears, status : Error ');
            console.log('data :' + data);
            console.log('status :' + status);
        });
});
GeoControllers.controller('geoController', function ($rootScope, $scope, $q, apiService) {

    $scope.years = $rootScope.years;
    console.log('In geoController $scope.years :');
    console.log($scope.years);
    $scope.yearSelected = $rootScope.years[0];
    console.log("$scope.yearSelected : ");
    console.log($scope.yearSelected);

    var updateDataOnYearChange = function (yearSelected) {

        console.log(" $scope.yearSelected.value : " + $scope.yearSelected.value);

        var TotalGoldMedalsResponse = null;
        apiService.getTotalGoldNumMedalsByYear(yearSelected)
            .success(function (data) {
                TotalGoldMedalsResponse = data;
                resolveDataForMap(TotalGoldMedalsResponse, 'gold');
            }).error(function (data, status) {
                console.log('Inside getSummaryByCountry, status : Error ');
                console.log('data :' + data);
                console.log('status :' + status);
            });

        var TotalSilverMedalsResponse = null;
        apiService.getTotalSilverNumMedalsByYear(yearSelected)
            .success(function (data) {
                TotalSilverMedalsResponse = data;
                resolveDataForMap(TotalSilverMedalsResponse, 'silver');
            }).error(function (data, status) {
                console.log('Inside getSummaryByCountry, status : Error ');
                console.log('data :' + data);
                console.log('status :' + status);
            });

        var TotalBronzeMedalsResponse = null;
        apiService.getTotalBronzeNumMedalsByYear(yearSelected)
            .success(function (data) {
                TotalBronzeMedalsResponse = data;
                resolveDataForMap(TotalBronzeMedalsResponse, 'bronze');
            }).error(function (data, status) {
                console.log('Inside getSummaryByCountry, status : Error ');
                console.log('data :' + data);
                console.log('status :' + status);
            });
    };
    var resolveDataForMap = function (MedalCountData, type) {
        $q.all([MedalCountData])
            .then(function (data) {
                formatDataForMap(data, type);
            });
    };

    var formatDataForMap = function (medalCounts, type) {
        var mapData = {};
        console.log("medalCounts : ");
        console.log(medalCounts);
        for (var item in medalCounts[0]) {
            //console.log("item :");
            //console.log(item);
            //console.log("item.cc_code :" + medalCounts[0][item].cc_code);
            //console.log("item.medal_count :" + medalCounts[0][item].medal_count);

            if (medalCounts[0][item].medal_count > 0) {
                var country_code = medalCounts[0][item].cc_code;
                mapData[country_code] = medalCounts[0][item].medal_count;
            }
        }
        if (type === 'gold') {
            $scope.goldMedalsData = mapData;
        } else if (type === 'silver') {
            $scope.SilverMedalsData = mapData;
        } else if (type === 'bronze') {
            $scope.BronzeMedalsData = mapData;
        }
    };

    $scope.$watch("yearSelected",function(newval,oldval){
        console.log("Year filter changed from "+oldval.value + " to " + newval.value);
        updateDataOnYearChange(newval.value);
    });
    updateDataOnYearChange($scope.yearSelected.value);
});
