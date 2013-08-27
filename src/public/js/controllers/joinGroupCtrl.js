"use strict";

angular.module('App').controller('JoinGroupCtrl', ['$scope', 'blockui', '$http', '$location', 'account', '$timeout',
    function($scope, blockui, $http, $location, account, $timeout){

    // public var
    $scope.query            = "";
    $scope.groups           = [];
    $scope.timer            = null;
    $scope.showLoader       = false;


    //public functions
    $scope.search = function(query){
        makeSearch(query);
    }

    var makeSearch = function(query){
        log("search for: " + query);

        NProgress.start();
        $http.post('/searchgroups', { groupName: query })
            .error(function(data, status, headers, config){
                log('error');
                NProgress.done();
                httpErrorCallback(data, status, headers, config);
                $scope.showLoader = false;
            })
            .success(function(data, status, headers, config) {
                log('success');
                NProgress.done();
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

    //binding the hide bottom bar event
    $timeout(function(){
        $scope.$broadcast('event:hideBottom');
    },1000);

    $scope.account = account;
}]);
