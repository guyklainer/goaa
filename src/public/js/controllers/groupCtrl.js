"use strict";

angular.module('App').controller('GroupCtrl', ['$scope', 'blockui', '$http', '$location', 'account', '$routeParams','$timeout',
    function($scope, blockui, $http, $location, account, $routeParams, $timeout){

        log("group Id: ", $routeParams.id);

        $scope.group = {
            name: "temp group",
            address  : {
                country: "",
                street: "",
                city: "",
                house: "",
                apartment: ""
            },
            image: "",
            posts: [
                new PostModel(),
                new PostPhotoModel(),
                new PostModel(),
                new PostModel()
            ]
        };

        var len = 200;
        $scope.toShortStr = function(post){
            var str = post.message;

            if (post.message.length > len){
                str = post.message.substr(0,len) + "...";
            }

            return str;
        }

        $scope.toggleTextLength = function(post){
            post.isShowFull = !post.isShowFull;
        }

        $scope.isTooBigMessage = function(message){
            var result = false;

            if (message.length > len){
                result = true;
            }

            return result;
        }

        $scope.account = account;
    }
]);

function PostModel(){
    return {
        id: "",
        username: "Oryan Mishali",
        date: new Date().setDate(-1),
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus cursus, magna id porta aliquet, enim nisi consequat risus, non varius lacus lorem vel felis. Nunc posuere adipiscing feugiat. Praesent hendrerit suscipit metus, quis accumsan libero imperdiet nec. Vivamus molestie turpis ac nunc eleifend et auctor nunc viverra. Pellentesque metus nisi, malesuada in elementum vitae, pulvinar bibendum nisl. Ut felis mi, blandit sed blandit at, lacinia sed nulla. Curabitur sollicitudin arcu a leo gravida ultricies. Donec massa purus, congue non elementum ac, volutpat ac lacus. Integer molestie turpis condimentum neque lobortis convallis. Nam nisl lorem, dapibus at pretium scelerisque, dignissim eu neque. Vestibulum quis nisl sem, eu porttitor nibh. In vulputate ipsum quis tortor sagittis eu ultricies nunc imperdiet. Nam eros enim, euismod quis ultricies sit amet, sagittis eget nisi. Suspendisse feugiat commodo neque ut fringilla. Nam odio erat, ultrices aliquet imperdiet vitae, luctus vitae purus.",
        photoUrl: ""
    }
};
function PostPhotoModel(){
    return {
        id: "",
        username: "Shushana",
        date: new Date().setDate(-1),
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus cursus, magna id porta aliquet, enim nisi consequat risus, non varius lacus lorem vel felis. Nunc posuere adipiscing feugiat. Praesent hendrerit suscipit metus, quis accumsan libero imperdiet nec. Vivamus molestie turpis ac nunc eleifend et auctor nunc viverra. Pellentesque metus nisi, malesuada in elementum vitae, pulvinar bibendum nisl. Ut felis mi, blandit sed blandit at, lacinia sed nulla. Curabitur sollicitudin arcu a leo gravida ultricies. Donec massa purus, congue non elementum ac, volutpat ac lacus. Integer molestie turpis condimentum neque lobortis convallis. Nam nisl lorem, dapibus at pretium scelerisque, dignissim eu neque. Vestibulum quis nisl sem, eu porttitor nibh. In vulputate ipsum quis tortor sagittis eu ultricies nunc imperdiet. Nam eros enim, euismod quis ultricies sit amet, sagittis eget nisi. Suspendisse feugiat commodo neque ut fringilla. Nam odio erat, ultrices aliquet imperdiet vitae, luctus vitae purus.",
        photoUrl: "http://www.gravatar.com/avatar/d41d8cd98f00b204e9800998ecf8427e.jpg?s=192"
    }
};