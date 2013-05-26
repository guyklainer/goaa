//angular.module('App')
app.controller('ComposeCtrl', ['$scope', 'blockui', '$http', '$location','$timeout','account',
    function($scope, blockui, $http, $location,$timeout, account){

        // public var

        $scope.account = account;

    }]);
