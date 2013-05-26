"use strict";

angular.module('App').controller('JoinGroupCtrl', ['$scope', 'blockui', '$http', '$location', 'account', '$cookies', 'db',
    function($scope, blockui, $http, $location, account, $cookies, db){

    // public var
    $scope.query        = "";
    $scope.groups       = [];
    $scope.timer        = null;
    $scope.showLoader   = false;


    //public functions
    $scope.search = function(){
        $scope.showLoader = true;

        if( $scope.timer != null ) {
            clearTimeout( $scope.timer );
            $scope.timer = null;
        }

        $scope.timer = setTimeout( function(){
            makeSearch();
        }, 1000 );
    }

    var makeSearch = function(){
        log("search for: " + $scope.query);

        db.add('groupsSearchQuery', $scope.query);

        $http.post('/searchgroups', { groupName: $scope.query })
            .error(function(data, status, headers, config){
                httpErrorCallback(data, status, headers, config);
                $scope.showLoader = false;
            })
            .success(function(data, status, headers, config) {
                log(data);

                if (data.result && angular.isArray(data.data)){
                    $scope.groups = data.data;
                    db.add('groupsSearch', $scope.groups);

                } else {
                    $scope.groups = [];
                    db.add('groupsSearch', $scope.groups);
                }

                $scope.showLoader = false;
            });
    };

    $scope.goToPreview = function(group){
        log("group preview");
        log(group);
        db.add('group', group);

        $location.path("/groupPreview");
    }

    $scope.account = account;
}]);
