"use strict";

app.factory('groupDb', ['$http', '$location', function($http, $location){

    var groups = [
        {   name: "oryan group2",
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
        }
    ];

    function addGroup(group) {
        groups.push(group);
    }
    function getGroupFromServer(groupName, callback){

        $http.post('/getgroupbyname', { name: groupName })
            .error(function(data, status, headers, config){
                httpErrorCallback(data, status, headers, config);
                callback(null);
            })
            .success(function(data, status, headers, config) {

                if (data.result){
                    addGroup(data.data);
                }
                callback(data.data);
            });
    }

    // Public API here
    return {
        groups: function(){
            return groups;
        },
        getGroup: function(groupName, callback){
            var groupResult = null;

            log("getGroup", groupName);

            angular.forEach(groups, function (group) {
                if (group.name.toLowerCase() == groupName) {
                    groupResult = group;
                    callback(group);
                }
            });

            if(groupResult == null){
                getGroupFromServer(groupName, callback);
            }
        }
    };
}]);

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