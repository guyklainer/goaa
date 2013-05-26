"use strict";

angular.module('App').controller('GroupCtrl', ['$scope', 'blockui', '$location', 'account', '$routeParams','$timeout', 'groupDb',
    function($scope, blockui, $location, account, $routeParams, $timeout, groupDb){

        $scope.isLoading = true;
        $scope.isNoMeters = false;
        $scope.view = $routeParams.view;
        $scope.groupName = $routeParams.groupName;
        $scope.partialEnum = {
            gallery: 'gallery',
            meters: 'meters',
            todos: 'todos'
        };

        groupDb.getGroup($routeParams.groupName, function(g){
            log("getGroup result: ", g);
            $scope.isLoading = false;
            $scope.group = g;

            //temporary
            $scope.group['meters'] = [
                {name: "boiler"},
                {name: "Living Room Light"},
                {name: "Air Conditioner"}
            ];
        });


        $scope.isShowNoNews = function(posts, isLoading){
            if (isLoading){
                return false;
            } else {
                return posts == undefined || posts == null || posts.length == 0;
            }
        }
        $scope.isShowNoPhotos = function(posts, isLoading){
            if (isLoading){
                return false;
            } else {
                return posts == undefined || posts == null || getPhotosCount(posts) == 0;
            }
        }
        function getPhotosCount(posts){
            return _.filter(posts,
                function(post){
                    return post.image && post.image != "";
                }).length;
        }
        $scope.isShowNoMeters = function(meters, isLoading){
            if (isLoading){
                return false;
            } else {
                return meters == undefined || meters == null || meters.length == 0;
            }
        }


        var len = 200;
        $scope.toShortStr = function(message){
            var str = message;

            if (message && message.length > len){
                str = message.substr(0,len) + "...";
            }

            return str;
        }
        $scope.toggleTextLength = function(post){
            post.isShowFull = !post.isShowFull;
        }
        $scope.isTooBigMessage = function(message){
            var result = false;

            if (message && message.length > len){
                result = true;
            }

            return result;
        }
        $scope.gotoPartial = function(partialEnumItem){
            if ($scope.view == undefined || $scope.view == null){
                $location.path( $location.path() + '/' + partialEnumItem );
            } else if ($scope.view.toLowerCase() != partialEnumItem){
                var index = $location.path().indexOf($routeParams.view);
                var url = $location.path().substr(0, index-1);
                $location.path( url + '/' + partialEnumItem );
            }
        }
        $scope.gotoMeter = function(meter){
            $location.path($location.path() + '/' + meter.name);
        }
        $scope.gotoGroupSettings = function(){
            $location.path('group/' + $routeParams.groupName + '/settings');
        }

        $scope.isShowPartial = function(view, partial){
            if (view == undefined || partial == undefined){
                return false;
            } else {
                return view.toLowerCase() == partial.toLowerCase();
            }
        }
        $scope.isShowNews = function(view){
            return !view;
        }

        $scope.account = account;
    }
]);

