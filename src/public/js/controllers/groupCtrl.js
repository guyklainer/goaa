"use strict";

angular.module('App').controller('GroupCtrl', ['$scope', 'blockui', '$location', 'account', '$routeParams','$timeout', 'groupDb',
    function($scope, blockui, $location, account, $routeParams, $timeout, groupDb){

        $scope.view = $routeParams.view;

        groupDb.getGroup($routeParams.name, function(g){
            log("getGroup result: ", g);
            $scope.group = g;
        });

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
        $scope.gotoGallery = function(){
            if ($scope.view == undefined || $scope.view == null){
                $location.path( $location.path() + "/gallery" );
            } else if ($scope.view.toLowerCase() != 'gallery'){
                log("todo path: ", $location.path());
            }
        }
        $scope.gotoMeters = function(){
            if ($scope.view == undefined || $scope.view == null){
                $location.path( $location.path() + "/meters" );
            } else if ($scope.view.toLowerCase() != 'meters'){
                log("todo path: ", $location.path());

            }
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

