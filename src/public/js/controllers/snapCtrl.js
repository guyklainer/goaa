"use strict";

angular.module('App').controller('SnapCtrl', ['$scope', '$location', '$route', '$timeout',
    function($scope, $location, $route, $timeout){

    // public var
    $scope.snapOpts = {
        disable: 'right'
    };
    $scope.menu = "home";


    // public functions
    $scope.gotoCreateGroup = function(){
        $location.path("/createGroup");
    };

    $scope.gotoJoinGroup = function(){
        $location.path("/joinGroup");
    };

    $scope.gotoComposePost = function(){
        $location.path("/compose");
    };

    $scope.$watch( function () { return $location.path(); },
        function ( val ) {
            if ($location.path().indexOf('/group') != -1) { // case in group
                $scope.menu = "group";
            }
        }, true);
}]);
