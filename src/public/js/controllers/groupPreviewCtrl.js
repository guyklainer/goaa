
angular.module('App').controller('GroupPreviewCtrl', ['$scope', 'blockui', '$http', '$location', 'account', '$routeParams', 'groupDb',
    function($scope, blockui, $http, $location, account, $routeParams, groupDb){

        log("groupName:", $routeParams.groupName);

        groupDb.getGroupPreview($routeParams.groupName,
        function(g){
            if (g != null){
                $scope.group = g;
                getLatLong( $scope.group.address.street + " "
                    + $scope.group.address.house + ", "
                    + $scope.group.address.city + ", "
                    + $scope.group.address.country );
            } else {
                $location.path("/");
            }
        });

        function getLatLong( address ){
            geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address':address},function(results, status){

                if (status != google.maps.GeocoderStatus.OK)
                    console.log(address + " " + status);

                else {
                    var myLatlng = new google.maps.LatLng( results[0].geometry.location.lat(), results[0].geometry.location.lng() );
                    var myOptions = {
                        zoom: 15,
                        center: myLatlng,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    var map = new google.maps.Map( document.getElementById( "google-map" ), myOptions );
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng( results[0].geometry.location.lat(), results[0].geometry.location.lng() ),
                        map: map
                    });
                }
            });
        }

        $scope.account = account;
    }]);
