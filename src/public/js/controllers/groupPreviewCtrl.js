
angular.module('App').controller('GroupPreviewCtrl', ['$scope', 'blockui', '$http', '$location', 'account', '$cookies', 'db',
    function($scope, blockui, $http, $location, account, $cookies, db){

        $scope.group = db.take('group');

        angular.extend($scope, {

            /** the initial center of the map */
            centerProperty: {
                latitude: 45,
                longitude: -73
            },

            /** the initial zoom level of the map */
            zoomProperty: 8,

            /** list of markers to put in the map */
            markersProperty: [ {
                latitude: 45,
                longitude: -74
            }],

            // These 2 properties will be set when clicking on the map
            clickedLatitudeProperty: null,
            clickedLongitudeProperty: null,
        });

    }]);
