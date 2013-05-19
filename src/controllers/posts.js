
var mongoose    = require( 'mongoose' ),
    Post        = mongoose.model( 'Post' ),
    Group       = mongoose.model( 'Group'),
    GroupUser   = mongoose.model( 'GroupUser' ),
    Utils       = require( '../utils/utils' ),
    _           = require( 'underscore' );

module.exports.addPost = function( req, res ) {
    var params  = req.body;

    Group.findOne( { _id: params.groupID }, function( err, group ){

        if ( err ) {
            res.json( Utils.createResult( false, err, "dbError" ) );
        }

        if( !group ){
            res.json( Utils.createResult( false, null, "noGroupFound" ) );
        } else {
            var groupPosts = group.posts,
                post = { userID: params.userID, data: params.data, createdOn: new Date() };
            console.log (groupPosts);
            groupPosts.push(post);
            group.update( { _id: group._id }, { posts: groupPosts }, { upsert: 1 });
//           Group.update( { _id: group._id }, { $push: { posts: { userID: params.userID, data: params.data, createdOn: new Date() } } } ) ;
            res.json( Utils.createResult( true, null, "postAdded" ) );
        }
    });
}

module.exports.removePost = function( req, res ) {
    var params  = req.body;

    Group.findOne( { _id: params.groupID }, function( err, group ){

        if ( err ) {
            res.json(Utils.createResult( false, err, "dbError" ));
        }

        if( !group ){
            res.json(Utils.createResult( false, null, "noGroupFound" ));
        } else {
            var posts = group.posts,
                isChanged = false;

            _.each( posts, function ( post ){
                if ( post._id == params.postID){
                    if ( validateIfUserCanRemovePost( params.user, group, post ) ){
                        delete post;
                        isChanged = true;
                    }
                    return false;
                }
            } );

            if ( isChanged ){
                Group.update( { _id: group._id }, { $set: { posts: posts } }, function( err ){
                    if( err ){
                        res.json( Utils.createResult( false, err, "dbError" ) );
                    } else {
                        res.json( Utils.createResult( true, null, "postRemoved" ) );
                    }
                });
            } else {
                res.json( Utils.createResult( false, null, "userCantDeletePost" ) );
            }
        }
    });
}


function validateIfUserCanRemovePost( user, group, post ){
    var isAdmin     = GroupUser.isAdmin ( user, group),
        isUsersPost = post.userID == user._id;

    if( isAdmin || isUsersPost ){
        return true;
    }

}