
var mongoose        = require( 'mongoose' ),
    utils           = require( '../utils/utils' ),
    _               = require( 'underscore' ),
    config          = require( '../settings/config' ),
    GroupUsers      = require( './groups-users' ),
    GroupUsersModel = mongoose.model( 'GroupUser' ),
    Group           = mongoose.model( 'Group' ),
    User            = mongoose.model( 'User' ),
    settings        = config.settings;

module.exports.joinGroup = function( req, res ){
    var params = req.body;

    GroupUsers.createUserGroupConnection( params.user, params.group, false, function( result ){
        res.json( result );
    });
}

module.exports.getGroupsByUser = function( req, res ){
    var userID          = req.body.userID,
        groupIDsArray   = [],
        result;

    GroupUsersModel.find( { user: userID, approved: true }, { group: 1, _id: 0 }, function( err, groupIDs ){
        if( err )
            res.json( utils.createResult( false, err, "dbError" ) );

        else {
            _.each( groupIDs, function( groupObj ){
                groupIDsArray.push( groupObj.group );
            });

            Group.find( { _id: { $in: groupIDsArray } }, { name: 1, _id: 1, image: 1 },  function( err, groups ) {
                if( err ){
                    result = utils.createResult( false, err, "dbError" );
                    return false;

                } else {
                    result = utils.createResult( true, groups, "fetchGroupsByUser" );
                }

                res.json( result );
            });
        }
    });
}

module.exports.getGroupByName = function( req, res ){

    var groupName   = req.body.name,
        users       = [];

    Group.findOne( { name: groupName  }, function( err, group ) {
        var returnedGroup = {};

        if( err ){
            res.json( utils.createResult( false, err, "dbError" ) );
            return false;

        } else {
            group.posts = _.sortBy( group.posts, function( post ){
                return ( -1 ) * post.createdOn;
            });

            returnedGroup.meters    = group.meters      ? group.meters  : [];
            returnedGroup.todos     = group.todos       ? group.todos   : [];
            returnedGroup.posts     = group.posts       ? group.posts   : [];
            returnedGroup._id       = group._id;
            returnedGroup.address   = group.address;
            returnedGroup.createdOn = group.createdOn;
            returnedGroup.image     = group.image;
            returnedGroup.name      = group.name;

            GroupUsersModel.find({ group: returnedGroup._id }, function( err, groupUsers ){
                if( err )
                    res.json( utils.createResult( true, err, "dbError" ) );

                else {
                    returnedGroup.notApproved = [];
                    _.each( groupUsers, function( groupUser ){

                        if( groupUser.user == req.user._id && !groupUser.approved ){
                            res.json( utils.createResult( false, null, "userNotApproved" ) );
                            return false;

                        } else if( groupUser.isAdmin )
                            returnedGroup.adminID = groupUser.user;

                        else if( !groupUser.approved )
                            returnedGroup.notApproved.push( groupUser.user );

                        users.push( groupUser.user );
                    });

                    User.find( { _id: { $in: users } }, function( err, users ){
                        if( err )
                            res.json( utils.createResult( false, err, "dbError" ) );

                        else {
                            returnedGroup.members = [];
                            _.each( users, function( user ){
                                returnedGroup.members.push( {
                                    username    : user.username,
                                    firstname   : user.firstName,
                                    lastname    : user.lastName,
                                    _id         : user._id
                                } );
                            });

                            res.json( utils.createResult( true, returnedGroup, "fetchGroupByName" ) );
                        }
                    });
                }
            });
        }
    });
}

module.exports.getGroupPreviewByName = function( req, res ){

    var groupName = req.body.name,
        result;

    Group.findOne( { name: groupName  }, { name: 1, _id: 1, image: 1, createdOn: 1, address: 1 }, function( err, group ) {
        if( err ){
            result = utils.createResult( false, err, "dbError" );
            return false;

        } else {
            group.posts = _.sortBy( group.posts, function( post ){
                return ( -1 ) * post.createdOn;
            });

            result = utils.createResult( true, group, "fetchGroupByName" );
        }

        res.json( result );
    });
}

module.exports.searchGroup = function ( req, res ){
    var groupName   = req.body.groupName,
        pattern     = "^" + groupName,
        exp         = new RegExp( pattern, "i" ),
        result      = {};

    if( groupName == undefined || groupName == "" ){
        res.json( utils.createResult( false, [], "emptyQuery" ) );

    } else {
        Group.find( { name: exp }, { name: 1, _id: 1, image: 1 }, function( err, docs ) {
            if ( err ){
                result = utils.createResult( false, err, "dbError" );

            } else if( !docs || docs.length == 0 ) {
                result = utils.createResult( false, [], "noResults" );

            } else {
                result = utils.createResult( true, docs, "foundGroups" );

            }

            res.json( result );
        });
    }
}

module.exports.editGroup = function( req, res ) {
    var params      = req.body,
        result      = {},
        groupID     = params.groupID;

    Group.update(
        { _id: groupID },

        { $set: {
            "address.country"   : params.address.country,
            "address.city"      : params.address.city,
            "address.street"    : params.address.street,
            "address.house"     : params.address.house,
            "address.apartment" : params.address.apartment,
            "image"             : params.image ? params.image : settings.defaultAvatar
        } },

        { upsert: true },

        function( err ){
            if ( err )
                result = utils.createResult( false, err, "dbError" );

            else
                result = utils.createResult( true, null, "groupUpdated" );

            res.json( result );
        }
    );
}

module.exports.makeGroup = function( req, res ) {
    var params = req.body;

    params.createdOn = new Date();
    if( params.image == undefined || params.image == "" ){
        params.image = settings.defaultAvatar;
    }

    validateGroupRequest( params, function( result ){
        if( result.result ){

            var group = new Group( params );
            group.save( function( err, group, count ){
                if( err ){
                    res.json( utils.createResult( false, err, "groupNotSavedToDB" ) );

                } else {
                    GroupUsers.createUserGroupConnection( req.user._id, group._id, true, function( result ){
                        res.json( result );
                    });

                }
            });

        } else {
            res.json( result );
        }
    });
}

module.exports.isGroupAdmin = function( req, res ) {
    var params = req.body;

    GroupUsers.isAdmin( params.user, params.group, function( result ){
        res.json( result );
    });

}

function validateGroupRequest ( params, callback ){

    var result = utils.isAllFieldsAreNotNullOrEmpty( params );

    if( result.result ) {
        isGroupExist( params.name, function( exist, group ){
            if( exist ){
                result = utils.createResult( false, group, "groupExist" );
            }

            callback( result );
        });

    } else {
        callback( result );
    }
}

function isGroupExist( name, callback ) {
    Group.findOne({ name: name }, function( err, group ){
        callback( group != null, group );
    });
}

module.exports.isGroupExist = function( req, res ){
    isGroupExist( req.body.name, function( exist, group ){
        if( exist ){
            res.json( utils.createResult( false, group, "groupExist" ) );

        } else {
            res.json( utils.createResult( true, null, "groupNotExist" ) );
        }
    });
}
