
var mongoose    = require( 'mongoose' ),
    utils       = require( '../utils/utils' )
    GroupUser   = mongoose.model( 'GroupUser' ),
    Group       = mongoose.model( 'Group');

module.exports.createUserGroupConnection = function( user, group, isAdmin, callback ){
    var params = {},
        result = null;

    params.createdOn    = new Date();
    params.user         = user;
    params.group        = group;
    params.isAdmin      = isAdmin;
    params.approved     = isAdmin ? true : false;

    isUserInGroup( user, group, function( result ){
        if( result.result ){
            callback( result );
            return false;
        }
    });

    var groupUser = new GroupUser( params );

    groupUser.save( function( err, group, count ){
        if( err ){
            result = utils.createResult( false, err, "dbError" );

        } else {
            result = utils.createResult( true, { groupID: group }, "connectionSuccess" );
        }

        callback( result );
    });
}

module.exports.isUserInGroup = function( req, res ){
    var params          = {};
        params.user     = req.body.user;
        params.group    = req.body.group;

    isUserInGroup( params.user, params.group, function( result ){
        res.json( result );
    });
}

module.exports.approveUser = function( req, res ){
    var params = req.body;

    GroupUser.findOne( { user: req.user._id, group: params.group }, function( err, groupUser ){
        if( err ){
            res.json( utils.createResult( false, err, "dbError" ) );
            return false;

        } else if( !groupUser.isAdmin ) {
            res.json( utils.createResult( false, null, "youAreNotAdmin" ) );
            return false;

        } else {
            GroupUser.findOne( { user: params.admin, group: params.group }, function( err, userGroup ){
                if( err )
                    res.json( utils.createResult( false, err, "dbError" ) );

                else {
                    GroupUser.update( { user: params.user, group: params.group }, { $set: { approved: true } }, function( err ){
                        if( err )
                            res.json( utils.createResult( false, err, "dbError" ) );

                        else
                            res.json( utils.createResult( true, null, "userApproved" ) );
                    });
                }

            });
        }

    });
}

module.exports.removeUserFromGroup = function( req, res ){
    var params = req.body,
        result = {};

    this.isAdmin( params.user, params.group, function( result ){
        if( result.result )
            changeAdmin( params.group, function( result ){
                if( result.msg == "dbError" )
                    res.json( result );
            });

        else if( result.msg == "dbError" )
            res.json( result );
    });

    GroupUser.remove( { group: params.group, user: params.user }, function( err ){
        if( err ){
            res.json( utils.createResult( false, err, "dbError" ) );
        }

        removeGroupIfIsEmpty( params.group, function( result ){
            res.json( result );
        });
    });
}

module.exports.isAdmin = function( user, group, callback ){
    var result = {};

    GroupUser.findOne( { user: user, group: group }, function( err, groupUser ){
        if( err ){
            return utils.createResult( false, err, "dbError" );

        } else if( groupUser && groupUser.isAdmin ){
            result = utils.createResult( true, null, "isAdmin" );

        } else {
            result = utils.createResult( false, null, "notAdmin" );
        }

        callback( result );
    });

}

function changeAdmin( group, callback ){
    GroupUser.findOne( { isAdmin: false, group: group } ).sort( { createdOn: 1 } ).exec( function( err, groupUser ){
        if ( err ) {
            callback( utils.createResult( false, err, "dbError" ) );

        } else {
            GroupUser.update( { _id: groupUser._id }, { $set: { isAdmin: true } }, function( err ){
                if ( err ) {
                    callback( utils.createResult( false, err, "dbError" ) );

                } else {
                    callback( utils.createResult( true, { admin: groupUser }, "adminChanged" ) );
                }
            });
        }
    });
}

function removeGroupIfIsEmpty( group, callback ){
    var result = {};

    GroupUser.count({}, function ( err, count ) {
        if( err )
            callback( utils.createResult( false, err, "dbError" ) );

        else if( count == 0 ) {
            Group.remove( { _id: group }, function( err ){
                if( err )
                    callback( utils.createResult( false, err, "dbError" ) );

                else
                    callback( utils.createResult( true, count, "groupRemoved" ) );
            });

        } else {
            callback( utils.createResult( false, count, "groupNotEmpty" ) );
        }
    });
}

function isUserInGroup( user, group, callback ) {
    var result = {};

    GroupUser.findOne( { user: user, group: group }, function( err, groupUser ){
        if( err )
            result = utils.createResult( false, err, "dbError" );

        else if( groupUser && groupUser.approved )
            result = utils.createResult( true, null, "allreadyInGroup" );

        else if( groupUser && !groupUser.approved )
            result = utils.createResult( true, null, "notApprovedYet" );

        else
            result = utils.createResult( false, null, "notInGroup" );

        callback( result );
    });
}
