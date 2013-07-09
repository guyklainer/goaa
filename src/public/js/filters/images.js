"use strict";

app.filter('images', function() {
    return function(posts) {
        return _.filter(posts,
            function(post){
                return post.image && post.image != "";
            });
    }
});