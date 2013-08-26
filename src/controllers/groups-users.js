
var mongoose        = require( 'mongoose' ),
    utils           = require( '../utils/utils' ),
    _               = require( 'underscore' ),
    config          = require( '../settings/config' ),
    sockets         = require( '../utils/sockets' ),
    UserInGroup     = mongoose.model( 'UserInGroup' ),
    Group           = mongoose.model( 'Group' ),
    User            = mongoose.model( 'User' ),
    settings        = config.settings;

module.exports.joinGroup = function( req, res ){
    var params      = req.body;

    addUser( params, "userJoined", res );
};

module.exports.addUserByID = function( req, res ){
    var params      = req.body,
        user        = { user : params.member, approved : true, groupID : params.groupID };

    addUser( user, "userAdded", res );
};

module.exports.approveUser = function( req, res ){
    var params      = req.body;

    Group.update( { _id: params.group, "members.user" : params.user }, { $set: { "members.$.approved" : true } }, function( err, numAffected, rawResponse ){
        if ( err )
            res.json( utils.createResult( false, err, "dbError" ) );

        else
            res.json( utils.createResult( true, rawResponse, "userApproved" ) );
    });
};

module.exports.removeUserFromGroup = function( req, res ){
    var params          = req.body,
        needNewAdmin    = false;

    isGroupAdmin( req, res, function( group ){
        if( group )
            needNewAdmin = true;

        Group.update( { _id: params.group }, { $pull: { "members" : { user : params.user } } }, function( err, numAffected, rawResponse ){
            if ( err )
                res.json( utils.createResult( false, err, "dbError" ) );

            else {
                if( needNewAdmin )
                    changeAdmin( req, res, function( result ){
                        if( result.result )
                            res.json( utils.createResult( true, result.data, "adminChanged" ) );
                        else
                            removeGroup( params.group, function( result ){
                                res.json( result );
                            });
                    });

                else
                    res.json( utils.createResult( true, rawResponse, "userRemoved" ) );
            }
        });
    });
};

module.exports.isUserInGroup = function( req, res ){
    var params          = req.body,
        currentMember   = {};

    Group.findOne( { _id : params.group, "members.user" : req.user._id }, function( err, group ){

        if ( err )
            res.json( Utils.createResult( false, err, "dbError" ) );

        else if ( group ){
            _.each( group.members, function( member ){
                if( member.user == req.user._id ){
                    currentMember = member;
                }
            });

            if( currentMember.approved )
                res.json( utils.createResult( true, null, "allreadyInGroup" ) );
            else
                res.json( utils.createResult( false, null, "notApprovedYet" ) );

        } else
            res.json( utils.createResult( false, null, "notInGroup" ) );
    });
};

module.exports.isGroupAdmin = function( req, res ) {

    isGroupAdmin( req, res, function( group ){
        if ( group )
            res.json( utils.createResult( true, null, "isAdmin" ) );

        else
            res.json( utils.createResult( false, null, "notAdmin" ) );
    });
};

var addUser = function( user, successMsg, res ) {
    var userInGroup = new UserInGroup( user );

    Group.update( { _id: user.groupID }, { $addToSet: { "members" : userInGroup } }, function( err, numAffected, rawResponse ){
        if ( err )
            res.json( utils.createResult( false, err, "dbError" ) );

        else
            res.json( utils.createResult( true, rawResponse, successMsg ) );
    });
};

var isGroupAdmin = function( req, res, callback ) {
    var params = req.body;

    Group.findOne( { _id : params.group, members : { $elemMatch : { user : params.user, isAdmin : true } } }, function( err, group ){
        if ( err )
            res.json( Utils.createResult( false, err, "dbError" ) );

        callback( group );
    });
};

var changeAdmin = function( req, res, callback ){
    var params = req.body;

    Group.findOne( { _id: params.group } ).exec( function( err, group ){
        if ( err )
            res.json( utils.createResult( false, err, "dbError" ) );

        else if( group.members.length == 0 ){
            callback( utils.createResult( false, err, "noMoreUsers" ) );
            return false;
        }

        group.members = _.sortBy( group.members, function( member ){
            return  member.createdOn;
        });

        var newAdmin = group.members[0].user;

        Group.update( { _id: params.group, "members.user" : newAdmin }, { $set: { "members.$.isAdmin" : true } }, function( err, numAffected, rawResponse ){
            if ( err )
                res.json( utils.createResult( false, err, "dbError" ) );

            else
                callback( utils.createResult( true, { admin: newAdmin }, "adminChanged" ) );
        });
    });
};