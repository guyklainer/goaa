
var mongoose    = require( 'mongoose' ),
    Post        = mongoose.model( 'Post' ),
    Group       = mongoose.model( 'Group'),
    Utils       = require( '../utils/utils'),
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
            Group.update( { _id: group._id }, { $push: { posts: { userID: params.userID, data: params.data, createdOn: new Date() } } } ) ;
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
            var posts = group.posts;

            _.each( posts, function ( post ){
                if ( post._id == params.postID){
                    delete post;
                    return false;
                }
            } );

            Group.update( { _id: group._id }, { $set: { posts: posts } }, function( err ){
                if( err ){
                    res.json(Utils.createResult( false, err, "dbError" ));
                } else {
                    res.json( Utils.createResult( true, null, "postRemoved" ));

                }
            });
        }
    });
}
