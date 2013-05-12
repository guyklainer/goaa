
angular.module('App').controller('GroupPreviewCtrl', ['$scope', 'blockui', '$http', '$location', 'account', '$cookies', 'db',
    function($scope, blockui, $http, $location, account, $cookies, db){

        $scope.group = db.take('group');

        function initialize() {
            var mapOptions = {
                center: new google.maps.LatLng(-34.397, 150.644),
                zoom: 8,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("map-canvas"),
                mapOptions);
        }
        google.maps.event.addDomListener(window, 'load', initialize);

    }]);
