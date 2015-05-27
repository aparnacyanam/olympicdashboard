/**
 * Created by shiva on 2/24/2015.
 */
angular.module('broadcastServices',[]).factory('filterEventBroadcastServices',function($rootScope){

    var filterEventServices = {};

    var YEAR_CHANGE_EVENT = "yearSelected",
        COUNTRY_CHANGE_EVENT = "countrySelected";


    filterEventServices.changeYear = function(){
        $rootScope.$broadcast(YEAR_CHANGE_EVENT);
    };

    filterEventServices.changeCountry = function(){
        $rootScope.$broadcast(COUNTRY_CHANGE_EVENT);
    };

    filterEventServices.onYearChange = function($scope,handler){
      $scope.$on(YEAR_CHANGE_EVENT, function(event, message){
          handler(message);
      });
    };

    filterEventServices.onCountryChange = function($scope,handler){
        $scope.$on(COUNTRY_CHANGE_EVENT, function(event, message){
            handler(message);
        });
    };

    return filterEventServices;
});