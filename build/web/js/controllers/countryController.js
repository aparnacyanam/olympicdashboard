/**
 * Created by shiva on 2/24/2015.
 */
var countryControllers = angular.module('country.controllers', []);
countryControllers.controller('countrySelectController1', ['$rootScope', '$scope', '$q', 'apiService',
    'filterEventBroadcastServices', function ($rootScope, $scope, $q, apiService, filterEventBroadcastServices) {

        apiService.getCountries()
            .success(function (response) {
                var countries = [];
                for (var country in response) {
                    var item = {};
                    //    item['label'] = 'country';
                    //    item['value'] = response[country].country;
                    item.label = 'country';
                    item.value = response[country].country;
                    countries.push(item);
                }
                $scope.countries = countries;
                //    $scope.countrySelected = 'United States'
                //    console.log("getCountries() : " + response);
                //    console.log(response);

            }).error(function (data, status) {
                console.log('Inside getCountries, status : Error ');
                console.log('data :' + data);
                console.log('status :' + status);
            });

        $scope.$watch("countrySelected", function (newValue, oldValue) {

            if (newValue === null && newValue === undefined) {
                //updateCountry(newValue);.
                //    $scope.countrySelected = 'United States'

            }
            if (newValue) {
                $rootScope.countrySelected = $scope.countrySelected.value;
                console.log('new countrySelected : ' + newValue);
                console.log('new countrySelected - $rootScope.countrySelected : ' + $rootScope.countrySelected);
                //   filterEventBroadcastServices.changeCountry();
            }
        });

        //var updateCountry = function (newCountry) {
        //    $rootScope.countrySelected = angular.copy(newCountry);
        //}

    }]);
countryControllers.controller('yearSelectController', ['$rootScope', '$scope', '$q', 'apiService',
    'filterEventBroadcastServices', function ($rootScope, $scope, $q, apiService, filterEventBroadcastServices) {

        apiService.getYears()
            .success(function (response) {
                var years = [];
                for (var year in response) {
                    var item = {};
                    //item['label'] = 'year';
                    //item['value'] = response[year].year;
                    item.label = 'year';
                    item.value = response[year].year;
                    years.push(item);
                }
                $scope.years = years;
                //    $scope.yearSelected = 2012;
                //    console.log("getYears() : " + response);
                //    console.log(response);

            }).error(function (data, status) {
                console.log('Inside getYears, status : Error ');
                console.log('data :' + data);
                console.log('status :' + status);
            });
        $scope.$watch("yearSelected", function (newValue, oldValue) {

            if (newValue === null && newValue === undefined) {
                //    $scope.yearSelected = 2012;

            }
            if (newValue) {
                console.log('new Year Selected : ' + newValue);
                $rootScope.yearSelected = angular.copy($scope.yearSelected.value);
                console.log('new Year Selected : $rootScope.yearSelected - ' + $rootScope.yearSelected);
                //    filterEventBroadcastServices.changeYear();
            }
        });

        //var updateYear = function(newYear){
        //    $rootScope.yearSelected = angular.copy(newYear);
        //}

    }]);
countryControllers.controller('countryController', function ($rootScope, $scope, $q, apiService, filterEventBroadcastServices) {


    //   console.log('In countryController $scope.countries :');
    //  console.log($scope.countries);

    var updateDataOnFiltersChange = function (newCountry, newYear) {

        var GoldMedals = $q.defer(),
            SilverMedals = $q.defer(),
            BronzeMetals = $q.defer();

        var allDataReceived = $q.all([GoldMedals.promise, SilverMedals.promise, BronzeMetals.promise]);

        apiService.getCountryMedalsByYear(newCountry, newYear, 'gold')
            .success(function (response) {
                GoldMedals.resolve(response);
            }).error(function (data, status) {
                console.log('Inside getCountries, status : Error ');
                console.log('data :' + data);
                console.log('status :' + status);
            });


        apiService.getCountryMedalsByYear(newCountry, newYear, 'silver')
            .success(function (response) {
                SilverMedals.resolve(response);
            }).error(function (data, status) {
                console.log('Inside getCountries, status : Error ');
                console.log('data :' + data);
                console.log('status :' + status);
            });

        apiService.getCountryMedalsByYear(newCountry, newYear, 'bronze')
            .success(function (response) {
                BronzeMetals.resolve(response);
            }).error(function (data, status) {
                console.log('Inside getCountries, status : Error ');
                console.log('data :' + data);
                console.log('status :' + status);
            });

        allDataReceived.then(function (data) {

            $scope.GoldMedals = data[0];
            $scope.SilverMedals = data[1];
            $scope.BronzeMedals = data[2];


            var gold_count = {};
            for (var medal1 in $scope.GoldMedals) {

                gold_count[$scope.GoldMedals[medal1].sports_category] = $scope.GoldMedals[medal1].count;
            }
            $scope.gold_count = gold_count;

            var silver_count = {};
            for (var medal2 in $scope.SilverMedals) {

                silver_count[$scope.SilverMedals[medal2].sports_category] = $scope.SilverMedals[medal2].count;
            }
            $scope.silver_count = silver_count;
            var bronze_count = {};
            for (var medal3 in $scope.BronzeMedals) {

                bronze_count[$scope.BronzeMedals[medal2].sports_category] = $scope.BronzeMedals[medal3].count;
            }
            $scope.bronze_count = bronze_count;
            var medalsByCategory = [];

            var allMedalTypesData = [];
            var totalGold = 0, totalSilver = 0, totalBronze = 0;
            for (var medal4 in $scope.BronzeMedals) {
                var item = {};
                //    console.log("$scope.BronzeMedals[medal4].sports_category :" + $scope.BronzeMedals[medal4].sports_category);
                //   console.log("gold_count[$scope.BronzeMedals[medal4].sports_category] :" + gold_count[$scope.BronzeMedals[medal4].sports_category]);
                //   console.log("silver_count[$scope.BronzeMedals[medal4].sports_category] :" + silver_count[$scope.BronzeMedals[medal4].sports_category]);
                //   console.log("$scope.BronzeMedals[medal4].sports_category :" + $scope.BronzeMedals[medal4].sports_category);
                //item['category'] = $scope.BronzeMedals[medal4].sports_category;
                //item['gold'] = gold_count[$scope.BronzeMedals[medal4].sports_category];
                //item['silver'] = silver_count[$scope.BronzeMedals[medal4].sports_category];
                //item['bronze'] = $scope.BronzeMedals[medal4].count;

                item.category = $scope.BronzeMedals[medal4].sports_category;
                item.gold = gold_count[$scope.BronzeMedals[medal4].sports_category];
                item.silver = silver_count[$scope.BronzeMedals[medal4].sports_category];
                item.bronze = $scope.BronzeMedals[medal4].count;

                totalGold = totalGold + gold_count[$scope.BronzeMedals[medal4].sports_category];
                totalSilver = totalSilver + silver_count[$scope.BronzeMedals[medal4].sports_category];
                totalBronze = totalBronze + $scope.BronzeMedals[medal4].count;
                allMedalTypesData.push(item);

                medalsByCategory[medal4] = {};

                medalsByCategory[medal4].category = {};
                medalsByCategory[medal4].category.value = $scope.BronzeMedals[medal4].sports_category;
                medalsByCategory[medal4].category.data = [];
                var morrisItem = {};

                morrisItem.label = 'gold';
                morrisItem.value = Number(gold_count[$scope.BronzeMedals[medal4].sports_category]);
                medalsByCategory[medal4].category.data.push(morrisItem);

                morrisItem = {};
                morrisItem.label = 'silver';
                morrisItem.value = Number(silver_count[$scope.BronzeMedals[medal4].sports_category]);
                medalsByCategory[medal4].category.data.push(morrisItem);

                morrisItem = {};
                morrisItem.label = 'bronze';
                morrisItem.value = Number($scope.BronzeMedals[medal4].count);
                medalsByCategory[medal4].category.data.push(morrisItem);

            }
            $scope.medalsByCategory = medalsByCategory;
            console.log(" allMedalTypesData : ");
            console.log(allMedalTypesData);
            $scope.allMedalByCategory = allMedalTypesData;

            $scope.totalGold = totalGold;
            $scope.totalSilver = totalSilver;
            $scope.totalBronze = totalBronze;
            console.log("medalsByCategory : ");
            console.log($scope.medalsByCategory);
        });
    };

    //filterEventBroadcastServices.onYearChange($scope, updateDataOnFiltersChange());
    //filterEventBroadcastServices.onCountryChange($scope, updateDataOnFiltersChange());

    // updateDataOnFiltersChange('United States',2012);

    $rootScope.$watch("countrySelected", function (newval, oldval) {
        console.log('Watching $rootScope.countrySelected, newval : ' + newval);
        console.log('Watching $rootScope.countrySelected, $rootScope.yearSelected : ' + $rootScope.yearSelected);
        if ($rootScope.yearSelected) {
            updateDataOnFiltersChange(newval, $rootScope.yearSelected);
        }
    });

    $rootScope.$watch("yearSelected", function (newval, oldval) {
        console.log('Watching $rootScope.yearSelected, newval : ' + newval);
        console.log('Watching $rootScope.yearSelected, $rootScope.countrySelected : ' + $rootScope.countrySelected);
        if ($rootScope.countrySelected) {
            updateDataOnFiltersChange($rootScope.countrySelected, newval);
        }
    });

});



