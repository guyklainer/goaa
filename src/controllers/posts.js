
var mongoose    = require( 'mongoose' ),
    GroupUsers  = require( './groups-users' ),
    Utils       = require( '../utils/utils' ),
    sockets     = require( '../utils/sockets' ),
    _           = require( 'underscore'),
    Group       = mongoose.model( 'Group' ),
    Post        = mongoose.model( 'Post' ),
    GroupUser   = mongoose.model( 'GroupUser' ),
    User        = mongoose.model( 'User' );

module.exports.addPost = function( req, res ) {
    var params  = req.body;


    User.findOne({ _id : req.user._id }, function( err, user ){
        if( err )
            res.json( Utils.createResult( false, err, "dbError" ) );
        else
            params.username = user.firstName + " " + user.lastName;
    });

    var post = new Post( params );

    Group.update( { _id: params.groupID }, { $push: { "posts": post } }, function( err, numAffected, rawResponse ){
        if ( err )
            res.json( Utils.createResult( false, err, "dbError" ) );

        else {
            sockets.getInstance().sockets.in( params.groupID ).emit( 'new-post', post );
            res.json( Utils.createResult( true, rawResponse, "postAdded" ) );
        }
    });
};

module.exports.removePost = function( req, res ) {
    var params          = req.body,
        removeCondition = { _id : params.postID };

    isUserAdmin( req, function( isAdmin ){

        if( !isAdmin )
            removeCondition.userID = req.user._id;

        Group.update( { _id: params.groupID }, { $pull : { "posts" : removeCondition } }, function( err, numAffected, rawResponse ) {
            if ( err )
                res.json( Utils.createResult( false, err, "dbError" ) );

            else
                res.json( Utils.createResult( true, rawResponse, numAffected + "postsRemoved" ) );
        });
    });
};

function isUserAdmin( req, callback ){
    GroupUsers.isAdmin( req.user._id, req,body.groupID, function( result ){
        callback( result.result );
    });
}