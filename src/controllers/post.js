
var mongoose    = require( 'mongoose' ),
    Post        = mongoose.model( 'Post' ),
    Group       = mongoose.model( 'Group'),
    Utils       = require( '../utils/utils' );

module.exports.addPost = function( req, res ) {
    var params  = req.body;

    Group.findOne( { _id: params.groupID }, function( err, group ){

        if ( err ) {
            return utils.createResult( false, err, "dbError" );
        }

        if( !group ){
           return result = utils.createResult( false, null, "noGroupFound" );
        } else {
            Group.update( { _id: group._id }, { $push: { posts: { userID: params.userID, data: params.data, createdOn: new Date() } } } ) ;
            return utils.createResult( true, null, "postAdded" );
        }
    });
}

module.exports.removePost = function( req, res ) {
    var params  = req.body;

    Group.findOne( { _id: params.groupID }, function( err, group ){

        if ( err ) {
            return utils.createResult( false, err, "dbError" );
        }

        if( !group ){
            return result = utils.createResult( false, null, "noGroupFound" );
        } else {
            var posts = group.posts,
                postID = params.postID;
//            _.each( posts, function ( post ){
//                if ( post._id == params.postID){
//                    delete post;
//                    return false;
//                }
//            } );
            Group.update( { _id: group._id }, { $pull: { posts: { _id: postID } } } );
//            Group.update( { _id: group.groupID }, { _id: post.postID } );
            return utils.createResult( true, null, "postAdded" );
        }
    });
}
