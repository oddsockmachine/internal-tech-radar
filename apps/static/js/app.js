/**
_author__    =	"Ashwini Chandrasekar(@sriniash)"
__email__     =	"ASHWINI_CHANDRASEKAR@homedepot.com"
__version__   =	"1.0"
__doc__       = "AngularJS entry point"
 */


'use strict';


/* App Module  that includes all the modules needed for this cu.App module
 ngRoute --- for routing
 ui.bootstrap --- for all bootstrap funcitionalities
 cu.Animations  -- custom module for animation that uses ngAnimate module
 controllers -- controller module that has all the controllers used

 */
/* based on the url flag use mock or real data
 * if mockData -- then load the ngMockE2E and the mockBackend Service */
var cuApp = angular.module('techRadarApp', [
    'ngRoute',
    'ui.bootstrap',
    'cuControllers',
    'cuServices',
    'cuDirectives',
    'ngAnimate'
]);

/*
 Define all the routing used for this app
 templateUrl --> have the partial url defined
 controller --> what controller to use

 */

cuApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/radar/:group', {
                templateUrl: '/static/partials/home.html',
                controller: 'TechController'
            }).when('/groups', {
                templateUrl: '/static/partials/groups.html',
                controller: 'GroupController'
            }).when('/admin', {
                templateUrl: '/static/partials/groups.html',
                controller: 'GroupController'
            }).
            otherwise({
                redirectTo: '/groups'
            });
    }]);

cuApp.run(function ($rootScope) {


});