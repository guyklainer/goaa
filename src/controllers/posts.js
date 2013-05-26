
var mongoose    = require( 'mongoose' ),
    Crypto      = require( 'crypto' ),
    Post        = mongoose.model( 'Post' ),
    Group       = mongoose.model( 'Group' ),
    GroupUser   = mongoose.model( 'GroupUser' ),
    GroupUsers  = require( './groups-users' ),
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

            User.findOne({ _id : params.userID }, function( err, user ){
                if( err )
                    res.json( Utils.createResult( false, err, "dbError" ) );

                 else {
                    var timestamp = new Date().getTime(),
                        post = {
                            _id         : Crypto.randomBytes( 48 ).toString('hex') + timestamp,
                            userID      : params.userID,
                            username    : user.firstName + " " + user.lastName,
                            data        : params.data,
                            image       : params.image,
                            createdOn   : new Date()
                        };

                    group.posts.push( post );
                    group.save( function( err ){

                        if( err ){
                            res.json( Utils.createResult( false, err, "dbError" ) );

                        } else {
                            res.json( Utils.createResult( true, null, "postAdded" ) );
                        }
                    });
                }
            });

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

            for( var i = 0; i < posts.length; i++ ){

                if ( posts[i]._id == params.postID ){

                    validateIfUserCanRemovePost( params.userID, group._id, posts[i], function( result ){
                        if( result ){
                            posts.splice( i, 1 );
                            updatePosts( group._id, posts, res );

                        } else {
                            res.json( Utils.createResult( false, null, "userCantDeletePost" ) );
                        }
                    });

                    break;
                }
            }
        }
    });
}

function updatePosts( groupID, posts, res ) {
    Group.update( { _id: groupID }, { $set: { posts: posts } }, function( err ){
        if( err ){
            res.json( Utils.createResult( false, err, "dbError" ) );
        } else {
            res.json( Utils.createResult( true, null, "postRemoved" ) );
        }
    });
}

function validateIfUserCanRemovePost( userID, groupID, post, callback ){

    var isUsersPost = post.userID == userID;

    GroupUsers.isAdmin( userID, groupID, function( result ){
        if( result.result || isUsersPost ){
            callback( true );

        } else {
            callback( false );
        }
    });
}