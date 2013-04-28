
angular.module('App').controller('LoginCtrl', ['$scope', 'blockui', '$http', function($scope, blockui, $http){

    var form = {
        username: "",
        password: "",
        remeberme: false
    };

    // public var
    $scope.form = form;

    var login = function() {

        log("login for username: " + form.username);

        blockui.block();

        $http.post('/login', form)
            .error(function(data, status, headers, config){
                httpErrorCallback(data, status, headers, config);
            })
            .success(function(data, status, headers, config) {
                log(data);
            });
    };

    // public functions
    $scope.login = login;

}]);
