
angular.module('App').controller('LoginCtrl', ['$scope', 'blockui', function($scope, blockui){

    var form = {
        email: "",
        password: "",
        remeberme: false
    };

    // public var
    $scope.form = form;

    var login = function() {

        log("login for email: " + form.email);
        //todo: login here
        blockui.block();

    };

    // public functions
    $scope.login = login;

}]);
