
angular.module('App').controller('LoginCtrl', ['$scope', 'blockui', '$http', '$location', 'account', '$cookies',
    function($scope, blockui, $http, $location, account, $cookies){

    // checking if logged in allready redirecting to Home
    if (account.isLoggedIn()){
        $location.path('/home')
    }

    var form = {
        username: "",
        password: "",
        remeberme: false
    }
    ,
    loginFailed = false;

    // public var
    $scope.form = form;
    $scope.loginFailed = loginFailed;

    var login = function() {

        log("login for username: " + form.username);

        blockui.block();

        $http.post('/login', form)
            .error(function(data, status, headers, config){
                $scope.loginFailed = true;
                setTimeout(function(){
                    if (status == 401){
                        log("user unauthorized");
                        blockui.unblock();
                    } else {
                        httpErrorCallback(data, status, headers, config);
                    }
                }, 500);
            })
            .success(function(data, status, headers, config) {
                log(data);
                if (data != null && data.result){
                    blockui.unblock();
                    $scope.loginFailed = false;
                    $cookies.user = '12' + angular.toJson(data.user);
                    account.update();
                    $location.path('/home');
                }
            });
    };

    // public functions
    $scope.login = login;
    $scope.account = account;
}]);
