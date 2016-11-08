/**
 *
__author__    =	"Ashwini Chandrasekar(@sriniash)"
__email__     =	"ASHWINI_CHANDRASEKAR@homedepot.com"
__version__   =	"1.0"
__doc__       = "Controller file for the application"
 */
'use strict';

var cuControllers = angular.module('cuControllers', [
]);
cuControllers.filter('capitalize', function () {
    return function (input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    };
});

cuControllers.filter('encodeURIComponent', function () {
    return function (group) {
        return group.replace(/ /g, '-');
    };

});
/*
 * Controller for adding active class to the menu*/
cuControllers.controller('menuBar', ['$scope', '$location', '$rootScope',
    function ($scope, $location, $rootScope) {
        $scope.isActive = function (viewLocation) {
            var service = (viewLocation.search('service') != -1 && $location.path().search('service') != -1 ),
                active = (viewLocation === $location.path() || ($location.path()).indexOf(viewLocation) === 0 || service);
            return active;

        };

        $rootScope.$on('$routeChangeStart', function (scope, next, current) {
            // console.log('Changing from ' + angular.toJson(current) + ' to ' + angular.toJson(next));
            $scope.title = '';
            if (next.params.group) {
                $scope.title = ' for ' + next.params.group;
            }

        });
    }]);
/*
 * Controller for adding active class to the menu*/
cuControllers.controller('GroupController', ['$scope', '$log', '$sce', 'TechnologyRadar', '$modal', '$location',
    function ($scope, $log, $sce, TechnologyRadar, $modal, $location) {
        var init = function init() {
            $scope.groupList = [];
            $scope.loading = true;
            $scope.getGroupList();
            $scope.admin = false;
            if ($location.path().indexOf('admin') == 1) {
                $scope.admin = true;
            }


        };
        $scope.getGroupList = function () {
            TechnologyRadar.getGroupList().then(function (value) {
                $scope.loading = false;
                $scope.groupList = value.group_list;
                $log.info('GROUP LIST -- ', $scope.groupList);
            }, function (reason) {
                $scope.fail = true;
                $scope.loading = false;
                $scope.class_name = 'red';
                var msg = (reason.data && reason.data.message) ? reason.data.message : techConstants.errorMsg;
                $log.error('Reason for Failure ---', msg);
                $scope.message = $sce.trustAsHtml('Reason for Failure ---' + msg);
            }, function (update) {
                $log.info('Update  ---', update);
            });
        };
        /*
         Adding groups
         */
        $scope.addGroup = function () {
            $modal.open({
                templateUrl: '/static/partials/groupsCreate.html',
                controller: 'GroupCreateController',
                size: 'sm',
                backdrop: 'static',
                resolve: {
                    delete_group: function () {
                        return false;
                    },
                    group: function () {
                        return '';
                    }

                }
            });
        };
        /*
         Delete groups
         */
        $scope.deleteGroup = function (group) {
            var delete_group = true;
            $modal.open({
                templateUrl: '/static/partials/groupsCreate.html',
                controller: 'GroupCreateController',
                size: 'sm',
                backdrop: 'static',
                resolve: {
                    delete_group: function () {
                        return delete_group;
                    },
                    group: function () {
                        return group;
                    }

                }
            });
        };
        $scope.$on("getGroupList", function (event, args) {

            $scope.getGroupList();
        });

        init();
    }]);

/**
 *  Group Modal Controller
 */
cuControllers.controller('GroupCreateController', ['$scope', '$modalInstance' , '$log', '$rootScope',
    'TechnologyRadar', '$sce', 'delete_group', 'group',
    function ($scope, $modalInstance, $log, $rootScope, TechnologyRadar, $sce, delete_group, group) {
        $scope.fail = false;
        $scope.deleteGroup = delete_group;
        $scope.group = group;

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };
        $scope.ok = function () {
            $scope.groups = $scope.groups.replace(/ /g, '-').split(',');
            $log.debug($scope.groups);
            $scope.loading = true;
            TechnologyRadar.addGroup($scope.groups).then(function (value) {
                $rootScope.$broadcast('getGroupList');

                $modalInstance.dismiss('cancel');

            }, function (reason) {
                $scope.fail = true;
                $scope.loading = false;
                $scope.class = 'red';
                var msg = (reason.data && reason.data.message) ? reason.data.message : techConstants.errorMsg;
                $log.error('Reason for Failure ---', msg);
                $scope.message = $sce.trustAsHtml('Reason for Failure ---' + msg);
            }, function (update) {
                $log.info('Update  ---', update);
            });
        };
        $scope.delete = function () {
            $log.debug($scope.group);
            $scope.loading = true;
            TechnologyRadar.deleteGroup($scope.group).then(function (value) {
                $rootScope.$broadcast('getGroupList');

                $modalInstance.dismiss('cancel');

            }, function (reason) {
                $scope.fail = true;
                $scope.loading = false;
                $scope.class = 'red';
                var msg = (reason.data && reason.data.message) ? reason.data.message : techConstants.errorMsg;
                $log.error('Reason for Failure ---', msg);
                $scope.message = $sce.trustAsHtml('Reason for Failure ---' + msg);
            }, function (update) {
                $log.info('Update  ---', update);
            });
        };

    }]);

/*
 * Controller for  tech radar*
 *  based on the group route parameter make  an api call to get the list
 *
 * */
cuControllers.controller('TechController', ['$scope', '$sce' , '$log', 'TechnologyRadar' , '$rootScope', '$modal',
    '$location', '$routeParams',
    function ($scope, $sce, $log, TechnologyRadar, $rootScope, $modal, $location, $routeParams) {

        var init = function () {
            /* only if valid groupname load the page*/
            var regexp = /^[a-zA-Z0-9-_]+$/;
            if ($routeParams.group.search(regexp) != -1) {
                $scope.techList = [];
                $scope.groupList = [];
                $scope.groupSelected = $routeParams.group;
                $scope.loading = true;
                $scope.fail = false;
                $scope.update = false;
                if ($location.search().update) {
                    $scope.update = true;
                }
                $scope.getTechList($scope.groupSelected);
            } else {
                $location.url('/');
            }
            $(window).scroll(function () {
                if ($(this).scrollTop() > 50) {
                    $('.scrolltop:hidden').stop(true, true).fadeIn();
                } else {
                    $('.scrolltop').stop(true, true).fadeOut();
                }
            });

        };
        $scope.scrollTop = function () {
            $('html, body').animate({
                scrollTop: $(".navbar").offset().top - 10000
            }, 1000);
        };

        var getCategories = function (techList) {
            var categories = _.pluck(techList, 'categories');
            return _.pluck(categories[0], 'label');
        };
        var getTechnologies = function (techList) {

            var categories = _.pluck(techList, 'categories');
            return _.flatten(_.pluck(_.flatten(categories), 'technologies'));
        };
        var getStatuses = function (techList) {
            return _.pluck(techList, 'label');
        };
        $scope.setActive = function (status) {
            _.each($scope.techList, function (status) {
                status.active = false;
            });
            status.active = true;
        };


        $scope.getTechList = function (group) {
            $scope.gotData = false;
            TechnologyRadar.getTechnologyList(group).then(function (value) {
                /* if tech_list is empty then invalid group name*/
                if (value['tech_list'].length != 0) {
                    $scope.loading = false;
                    $scope.gotData = true;
                    /* populate the project list*/
                    $scope.techList = value['tech_list'];
                    $log.info('Tech List MAIN -- ', $scope.techList);

                    $scope.radarData = value['tech_list'];
                    $scope.categories = getCategories($scope.techList);
                    $scope.technologies = getTechnologies($scope.techList);
                    $scope.statuses = getStatuses($scope.techList);
                    $scope.activeCategory = {};
                    $scope.activeStatus = {};
                    $scope.activeTechLabel = '';
                    $scope.currentCategory = '';
                    $scope.currentTech = '';
                    $scope.tech_data = {};
                    $scope.viewTech = false;
                    $log.info('Tech List -- ', $scope.techList);
                    $log.info('Tech Categories -- ', $scope.categories);
                    $log.info('Tech technologies -- ', $scope.technologies);
                    $log.info('Tech Statues -- ', $scope.statuses);
                    //console.log($scope.radarData[0]);
                    $scope.setActive($scope.techList[0]);
                    $rootScope.$broadcast("redraw");
                } else {
                    /**
                     * invalid groupname so redirect ot 404
                     */
                    $location.url('/');

                }


            }, function (reason) {
                $scope.loading = false;
                $scope.fail = true;
                $scope.class_name = 'red';
                var msg = (reason.data && reason.data.message) ? reason.data.message : techConstants.errorMsg;
                $log.error('Reason for Failure ---', msg);
                $scope.message = $sce.trustAsHtml('Reason for Failure ---' + msg);
            }, function (update) {
                $log.info('Update  ---', update);
            });
        };

        /**
         * Remove the technology
         * @param category
         * @param tech
         */
        $scope.removeTech = function (category, status, tech) {
            var tech_data = {
                'status': status,
                'category': category,
                'tech': tech
            };
            $modal.open({
                templateUrl: '/static/partials/techDelete.html',
                controller: 'TechDeleteController',
                size: 'sm',
                backdrop: 'static',
                resolve: {
                    tech_data: function () {
                        return tech_data;
                    },
                    categoryList: function () {
                        return $scope.categories;
                    },
                    statusList: function () {
                        return $scope.statuses;
                    },
                    group: function () {
                        return $scope.groupSelected;
                    }
                }});

        };
        /**
         * Info about the technology
         * @param status
         * @param technology
         * @param clicked
         */
        $scope.infoTech = function (status, technology, clicked) {
            $scope.currentStatus = status;
            $scope.currentTech = technology.label;
            $scope.description = $sce.trustAsHtml(technology.description);
            if (clicked) {
                $scope.viewTech = true;
            }
        };
        /**
         * Close the info div
         */
        $scope.closeInfo = function () {
            $scope.currentCategory = '';
            $scope.currentTech = '';
            $scope.activeCategory = '';
            $scope.activeStatus = '';
            $scope.tech_data = {};
            $scope.viewTech = false;
            $scope.showInfo = false;
            // Fade all the segments.
            d3.selectAll("text")
                .style("opacity", 1).style('font-weight', 'normal').style('cursor', 'default');
        };
        /**
         * edit the tech info
         * @param category
         * @param tech
         */
        $scope.editTech = function (category, status, technology) {
            var tech_data = {
                'status': status.label,
                'category': category.label,
                'tech': technology
            };
            $scope.showInfoModal(tech_data, false);

        };
        /**
         * AddTech
         */
        $scope.addTech = function (category, status) {
            var tech_data = {
                'status': status,
                'category': category
            };
            $scope.showInfoModal(tech_data, false);

        };
        /**
         * toggle the view for each status
         * @param $event
         */
        $scope.collapse = function ($event) {
            if ($(event.target.parentNode.nextElementSibling.nextElementSibling).is(':visible')) {
                $(event.target.parentNode.nextElementSibling.nextElementSibling).fadeOut();
            } else {
                $(event.target.parentNode.nextElementSibling.nextElementSibling).fadeIn();
            }

        };

        /**
         * functions for d3 svg click and update
         * setVariables
         * displayLabels
         * hideLabels
         */

        $scope.$on("setActiveTab", function (event, args) {
            $scope.setActive(args);
        });
        $scope.$on("showInfo", function (event, status, tech) {
            $scope.infoTech(status, tech);

        });
        $scope.$on("setVariables", function (event, args) {

            $scope.setVariables(Object.keys(args)[0], args[Object.keys(args)[0]]);
        });
        $scope.$on("getTechList", function (event, args) {

            $scope.getTechList($scope.groupSelected);
        });
        /**
         * set variables from the directive
         * @param variable
         * @param value
         */
        $scope.setVariables = function (variable, value) {
            $scope[variable] = value;
        };
        /**
         * display the labels
         */
        $scope.displayLabels = function () {
            $scope.activeCategory = _.findWhere(_.flatten(_.pluck($scope.techList, 'categories')), {active: true});
            $scope.activeStatus = _.find($scope.techList, function (status) {
                return _.indexOf(status.categories, $scope.activeCategory) >= 0;
            });

        };
        /**
         * hide labels
         */
        $scope.hideLables = function () {
            _.each(_.flatten(_.pluck($scope.techList, 'categories')), function (k, v) {
                if (k.active) {
                    k.active = false;
                }
            });

        };
        /**
         * modal for info
         * view -- flag to set if view only or edit
         */
        $scope.showInfoModal = function (tech_data, view) {
            var editInfo = (view) ? false : true;
            var size = 'lg';
            $modal.open({
                templateUrl: '/static/partials/techInfo.html',
                controller: 'TechInfoController',
                size: size,
                backdrop: 'static',
                resolve: {
                    tech_data: function () {
                        return tech_data;
                    },
                    editInfo: function () {
                        return editInfo;
                    },
                    categoryList: function () {
                        return $scope.categories;
                    },
                    statusList: function () {
                        return $scope.statuses;
                    }, group: function () {
                        return $scope.groupSelected;
                    }

                }});

        };

        init();
    }]);

/**
 * Tech Info  Modal Controller
 */
cuControllers.controller('TechInfoController', ['$scope', '$modalInstance' , 'tech_data', '$log', 'editInfo', '$rootScope',
    'categoryList', 'statusList', 'group', 'TechnologyRadar', '$sce',
    function ($scope, $modalInstance, tech_data, $log, editInfo, $rootScope, categoryList, statusList, group, TechnologyRadar, $sce) {
        $scope.fail = false;

        $scope.tech_data = tech_data;
        $scope.editInfo = editInfo;
        $scope.categoryList = categoryList;
        $scope.statusList = statusList;
        $scope.tech = {
            'category': tech_data.category,
            'status': tech_data.status,
            'tech': tech_data.tech,
            'group': group
        };
        if (tech_data.tech) {
            $scope.description = $sce.trustAsHtml(tech_data.tech.description);
        }

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
            $rootScope.$broadcast('setVariables', {'viewTech': false});
            d3.selectAll("text")
                .style("opacity", 1).style('font-weight', 'normal').style('cursor', 'default');
            $('.bold').removeClass('bold');
        };
        $scope.ok = function () {
            $log.debug($scope.tech);
            if (!$scope.tech.tech) {
                /* description no there*/
                $scope.tech.tech = {};
                $scope.tech.tech.description = '';
            }
            $log.debug('AFTER --', $scope.tech);

            $scope.loading = true;
            TechnologyRadar.editTech($scope.tech).then(function (value) {
                $rootScope.$broadcast('getTechList');

                $modalInstance.dismiss('cancel');

            }, function (reason) {
                $scope.fail = true;
                $scope.loading = false;
                $scope.class = 'red';
                var msg = (reason.data && reason.data.message) ? reason.data.message : techConstants.errorMsg;
                $log.error('Reason for Failure ---', msg);
                $scope.message = $sce.trustAsHtml('Reason for Failure ---' + msg);
            }, function (update) {
                $log.info('Update  ---', update);
            });
        };

    }]);
/**
 * Tech Info   Delete Modal Controller
 */
cuControllers.controller('TechDeleteController', ['$scope', '$modalInstance' , 'tech_data', '$log', '$rootScope',
    'categoryList', 'statusList', 'group', 'TechnologyRadar', '$sce',
    function ($scope, $modalInstance, tech_data, $log, $rootScope, categoryList, statusList, group, TechnologyRadar, $sce) {

        $scope.tech_data = tech_data;
        $scope.categoryList = categoryList;
        $scope.statusList = statusList;
        $scope.tech = {
            'category': tech_data.category,
            'status': tech_data.status,
            'tech': tech_data.tech,
            'group': group
        };
        $scope.close = function () {
            $modalInstance.dismiss('cancel');

        };
        $scope.ok = function () {
            $log.debug($scope.tech)
            TechnologyRadar.deleteTech($scope.tech).then(function (value) {
                $rootScope.$broadcast('getTechList');
                $modalInstance.dismiss('cancel');

            }, function (reason) {
                $scope.fail = true;
                $scope.class = 'red';
                var msg = (reason.data && reason.data.message) ? reason.data.message : techConstants.errorMsg;
                $log.error('Reason for Failure ---', msg);
                $scope.message = $sce.trustAsHtml('Reason for Failure ---' + msg);
            }, function (update) {
                $log.info('Update  ---', update);
            });
            $modalInstance.dismiss('cancel');
        };

    }]);