"use strict";

angular.module('App').controller('HomeCtrl', ['$scope', 'blockui', '$http', '$location', 'account', 'groupDb', 'contextService',
    function($scope, blockui, $http, $location, account, groupDb, contextService){

    // public var
    $scope.isNoGroups       = false;
    $scope.groups           = [];
    $scope.homePage         = true;
    $scope.newPosts         = [];
    $scope.newTodos         = [];

    _.each( $scope.groups, function( group ){
        $scope.newPosts[ group._id ] = 0;
        $scope.newTodos[ group._id ] = 0;
    });

    groupDb.getGroups(account.user()._id, function(groupsResult){
        if (groupsResult != null){
            $scope.groups = groupsResult;
            contextService.groups.val = groupsResult;
            $scope.isNoGroups = $scope.groups.length == 0;
        } else {
            $scope.isNoGroups = true;
        }
    });

    $scope.$on('event:auth-loginRequired', function() {
        log("auth-loginRequired, redirecting to login");
        $location.path('/login');
    });
    $scope.$on('event:auth-loginConfirmed', function() {
        log('!! auth-loginConfirmed');
    });

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

    $scope.moveToGroup = function(group){
        log("group",group);
        $location.path("/group/" + group.name);
    };

    $scope.groupCount = function( group ){
        if( $scope.newPosts[group._id] && $scope.newTodos[group._id] )
            return $scope.newPosts[group._id] + $scope.newTodos[group._id];

        else return 0;
    };

    $scope.account = account;
}]);
