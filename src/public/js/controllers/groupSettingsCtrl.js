"use strict";

angular.module('App').controller('GroupSettingsCtrl', ['$scope', 'blockui', '$location', 'account', '$routeParams','$timeout', 'groupDb',
    function($scope, blockui, $location, account, $routeParams, $timeout, groupDb){

        log($routeParams.groupName);
        $scope.isGroupAdmin = false;

        //todo check is user group admin
        if (true) {
            $scope.isGroupAdmin = true;
        } else {

        }

        groupDb.getGroup($routeParams.groupName, function(g){
            if (g != null){
                $scope.group = g;
                addAddressString($scope.group);
                addMembers($scope.group);
            } else {
                $location.path("/");
            }
        });

        //todo temporary
        function addMembers(group){
            group.members = [
                MemberModel(1, 'oryan mishali', false),
                MemberModel(2, 'oryan 2', true),
                MemberModel(3, 'oryan 3', false),
                MemberModel(4, 'oryan ssdfsdf', false)
            ];
        }
        function MemberModel(id, name, isAdmin){
            return {
                user: name,
                id: id,
                isAdmin: isAdmin
            };
        }

        function addAddressString(group){
            if (group != undefined && group != null && group.address != null){
                group.addressString =  group.address.street + " " + group.address.house + ", "
                                            + group.address.city + ", " + group.address.country;
            } else {
                group.addressString = "";
            }
        }

        $scope.account = account;
    }
]);