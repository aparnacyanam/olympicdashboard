/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module('olympicsApi',[]).factory('apiService',['$http',function($http){
   var apiService = {};
   var baseUrl = '/api';

    apiService.getSummaryByCountry = function(){
      console.log('getSummaryByCountry Url :'+baseUrl + '/totalNumMedals');
       return $http({  method : 'GET', url : baseUrl + '/totalNumMedals' });
       
   };

    apiService.getYears = function(year){
        console.log('getYears Url :'+baseUrl + '/getYears');
        return $http({  method : 'GET', url : baseUrl + '/getYears'});
    };

    apiService.getCountries = function(){
        console.log('getCountries Url :'+baseUrl + '/getCountries');
        return $http({  method : 'GET', url : baseUrl + '/getCountries'});
    };

    apiService.getTotalGoldNumMedalsByYear = function(year,medalType){
        console.log('getTotalGoldNumMedalsByYear Url :'+baseUrl + '/totalGoldNumMedalsByYear');
        return $http({  method : 'GET', url : baseUrl + '/totalGoldNumMedalsByYear?year='+ year });
    };

    apiService.getTotalSilverNumMedalsByYear = function(year,medalType){
        console.log('getTotalSilverNumMedalsByYear Url :'+baseUrl + '/totalSilverNumMedalsByYear');
        return $http({  method : 'GET', url : baseUrl + '/totalSilverNumMedalsByYear?year='+ year });
    };

    apiService.getTotalBronzeNumMedalsByYear = function(year,medalType){
        console.log('getTotalBronzeNumMedalsByYear  Url :'+baseUrl + '/totalBronzeNumMedalsByYear');
        return $http({  method : 'GET', url : baseUrl + '/totalBronzeNumMedalsByYear?year='+ year });
    };

    apiService.getCountryMedalsByYear = function(country,year,medalType){
        console.log('getCountryMedalsByYear  Url :'+baseUrl + '/getCountryMedalsByYear?year='+ year +'&medal='+medalType+'&country='+country);
        return $http({  method : 'GET', url : baseUrl + '/getCountryMedalsByYear?year='+ year +'&medal='+medalType+'&country='+country });
    };

    apiService.getPlayers = function(country){
        console.log('getPlayers  Url :'+baseUrl + '/getPlayers?country='+country);
        return $http({  method : 'GET', url : baseUrl + '/getPlayers?country='+country });
    };

    apiService.getPlayerMedalCount = function(player){
        console.log('getPlayerMedalCount  Url :'+baseUrl + '/getPlayerMedalCount?player='+player);
        return $http({  method : 'GET', url : baseUrl + '/getPlayerMedalCount?player='+player });
    };

    apiService.getPlayerInfo = function(player){
        console.log('getPlayerInfo  Url :'+baseUrl + '/getPlayerInfo?player='+player);
        return $http({  method : 'GET', url : baseUrl + '/getPlayerInfo?player='+player });
    };

    apiService.getUser = function(player){
        console.log('getUser  Url :'+  '/login');
        return $http({  method : 'GET', url : '/login'});
    };

    apiService.logOut = function(player){
        console.log('logOut  Url :'+  '/logout');
        return $http({  method : 'GET', url : '/logout'});
    };

    return apiService;
}]);

