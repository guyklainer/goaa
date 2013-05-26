"use strict";

angular.module('App').controller('GroupCtrl', ['$scope', 'blockui', '$http', '$location', 'account', '$routeParams','$timeout', 'groupDb',
    function($scope, blockui, $http, $location, account, $routeParams, $timeout, groupDb){

        log("group Id: ", $routeParams.name);
        log("group view: ", $routeParams.view);

        $scope.view = $routeParams.view;

        groupDb.getGroup($routeParams.name, function(g){
            log("callback res: ", g);
            $scope.group = g;
        });

        var len = 200;
        $scope.toShortStr = function(post){
            var str = post.message;

            if (post.message.length > len){
                str = post.message.substr(0,len) + "...";
            }

            return str;
        }
        $scope.toggleTextLength = function(post){
            post.isShowFull = !post.isShowFull;
        }
        $scope.isTooBigMessage = function(message){
            var result = false;

            if (message.length > len){
                result = true;
            }

            return result;
        }
        $scope.gotoGallery = function(){
            if ($scope.view == undefined || $scope.view == null){
                $location.path( $location.path() + "/gallery" );
            } else if ($scope.view.toLowerCase() != 'gallery'){
                log("path: ", $location.path());
            }
        }

        $scope.account = account;
    }
]);

