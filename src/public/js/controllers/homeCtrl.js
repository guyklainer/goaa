"use strict";

angular.module('App').controller('HomeCtrl', ['$scope', 'blockui', '$http', '$location', 'account', 'groupDb',
    function($scope, blockui, $http, $location, account, groupDb){

    // public var
    $scope.isNoGroups       = false;
    $scope.groups           = [];
    $scope.homePage         = true;

    groupDb.getGroups(account.user()._id, function(groupsResult){
        if (groupsResult != null){
            $scope.groups = groupsResult;
            $scope.isNoGroups = $scope.groups.length == 0;
        } else {
            $scope.isNoGroups = true;
        }
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
    $scope.account = account;
}]);
