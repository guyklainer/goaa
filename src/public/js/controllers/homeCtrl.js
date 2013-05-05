
angular.module('App').controller('HomeCtrl', ['$scope', 'blockui', '$http', '$location', 'account',
    function($scope, blockui, $http, $location, account){

    $scope.account = account;
}]);
