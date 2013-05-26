
var mongoose    = require( 'mongoose' ),
    Crypto      = require( 'crypto' ),
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

            var timestamp = new Date().getTime(),
                post = { 
                _id         : Crypto.randomBytes( 48 ).toString('hex') + timestamp,
                userID      : params.userID, 
                data        : params.data, 
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