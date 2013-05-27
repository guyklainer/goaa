"use strict";

angular.module('App').controller('JoinGroupCtrl', ['$scope', 'blockui', '$http', '$location', 'account',
    function($scope, blockui, $http, $location, account){

    // public var
    $scope.showBottomMenu   = true;
    $scope.query            = "";
    $scope.groups           = [];
    $scope.timer            = null;
    $scope.showLoader       = false;


    //public functions
    $scope.search = function(query){
        $scope.showLoader = true;

        if( $scope.timer != null ) {
            clearTimeout( $scope.timer );
            $scope.timer = null;
        }

        $scope.timer = setTimeout( function(){
            makeSearch(query);
        }, 1000 );
    }

    var makeSearch = function(query){
        log("search for: " + query);

        $http.post('/searchgroups', { groupName: query })
            .error(function(data, status, headers, config){
                httpErrorCallback(data, status, headers, config);
                $scope.showLoader = false;
            })
            .success(function(data, status, headers, config) {
                log(data);

                if (data.result && angular.isArray(data.data)){
                    $scope.groups = data.data;
                } else {
                    $scope.groups = [];
                }

                $scope.showLoader = false;
            });
    };

    $scope.goToPreview = function(group){
        log("group preview");
        log(group);

        $location.path("/groupPreview/" + group.name);
    }

    $scope.account = account;
}]);
