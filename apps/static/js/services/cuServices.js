/**
 *
__author__    =	"Ashwini Chandrasekar(@sriniash)"
__email__     =	"ASHWINI_CHANDRASEKAR@homedepot.com"
__version__   =	"1.0"
__doc__       = " TechRadar Services file -- all Backend calls are made from this file"
 */
'use strict';

/* Services */

var cuServices = angular.module('cuServices', []);
/* TechnologyList Services*/

cuServices.factory('TechnologyRadar', ['$http', '$timeout', '$q', '$log' , function ($http, $timeout, $q, $log) {
    var technologies = {
        baseUrl: '',
        techList: [],
        getGroupList: function (group) {
            var url = '/groups?time_stamp=',
                deferred = $q.defer();
            url += Date.now();
            $log.info(url);
            $http.get(url).success(function (data) {
                deferred.resolve(data);
            }).error(function () {
                deferred.reject("error");
            });
            return deferred.promise;
        },
        addGroup: function (group) {
            var url = '/groups?time_stamp=',
                deferred = $q.defer();
            url += Date.now();
            $log.info(url);
            $http.post(url, {'groups': group}).success(function (data) {
                deferred.resolve(data);
            }).error(function (data) {
                var reason = {'data':data}
                deferred.reject(reason);
            });
            return deferred.promise;
        },
        deleteGroup: function (group) {
            var url = '/groups/delete?time_stamp=',
                deferred = $q.defer();
            url += Date.now();
            $log.info(url);
            $http.post(url, {'groups': group}).success(function (data) {
                deferred.resolve(data);
            }).error(function () {
                deferred.reject("error");
            });
            return deferred.promise;
        },
        getTechnologyList: function (group) {
            var url = '/technology?group=' + group + '&time_stamp=',
            //var url = '/static/js/tech_data.json?time_stamp=',
                deferred = $q.defer();
            url += Date.now();
            $log.info(url);
            $http.get(url).success(function (data) {
                deferred.resolve(data);
            }).error(function () {
                deferred.reject("error");
            });
            return deferred.promise;
        },
        editTech: function (tech) {
            var url = '/technology?update=true&time_stamp=',
            //var url = '/static/js/tech_data.json?time_stamp=',
                deferred = $q.defer(), form_data;
            form_data = tech;
            if (!tech['technology']) {
                form_data['technology'] = tech['tech']['label'];
                url = '/technology?update=true&time_stamp=';
            } else {
                url = '/technology?time_stamp='
            }
            form_data['description'] = tech['tech']['description'];
            url += Date.now();

            $log.info(url);
            $http.post(url, form_data).success(function (data) {
                deferred.resolve(data);
            }).error(function () {
                deferred.reject("error");
            });
            return deferred.promise;
        },
        deleteTech: function (tech) {
            var url = '/technology/delete?time_stamp=',
            //var url = '/static/js/tech_data.json?time_stamp=',
                deferred = $q.defer(), form_data;
            url += Date.now();
            form_data = tech;

            form_data['technology'] = tech['tech']['label'];

            $log.info(url);
            $http.post(url, form_data).success(function (data) {
                deferred.resolve(data);
            }).error(function () {
                deferred.reject("error");
            });
            return deferred.promise;
        }
    };
    return technologies;
}]);