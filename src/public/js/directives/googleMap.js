'use strict';

app.directive('googleMap', function($timeout) {
    return {
        templateUrl: "/template/directives/googleMap.html",
        replace: true,
        scope: {
            address: "="
        },
        link: function(scope, element, attrs, controller){
            log("linking google map", scope);


            scope.$watch('address', function() {
                getLatLong(scope.address);
            });


            function getLatLong( address ){
                var geocoder = new google.maps.Geocoder();
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
        }
    };
});