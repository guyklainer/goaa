
angular.module('App').controller('HomeCtrl', ['$scope', 'blockui', '$http', '$location', 'account',
    function($scope, blockui, $http, $location, account){

    var groups =
        [new GroupViewModel("group1"),
        new GroupViewModel("group2"),
        new GroupViewModel("group3")]
        ;

    // public var
    $scope.groups = groups;



    $scope.account = account;
}]);

var GroupViewModel = function(groupName){
    return {
        name: groupName,
        address: {
            street: "",
            city: "",
            number: 0
        },
        imgLocation: ""
    }
};