
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

module.exports.addUserByName = function( req, res ){
    var params      = req.body,
        user        = { user : params.member, isAdmin : true, approved : true };

    addUser( user, "userAdded", res );
};

module.exports.approveUser = function( req, res ){
    var params      = req.body;

    Group.find( { _id: params.group, "members.user" : params.user }, function( err, group ){console.log(group);});

    Group.update( { _id: params.group, "members.user" : params.user }, { $set: { "members.$.approved" : true } }, function( err, numAffected, rawResponse ){
        if ( err )
            res.json( utils.createResult( false, err, "dbError" ) );

        else
            res.json( utils.createResult( true, rawResponse, "userApproved" ) );
    });
};

module.exports.removeUserFromGroup = function( req, res ){
    var params = req.body;

    Group.update( { _id: params.group }, { $pull: { "members" : { user : params.user } } }, function( err, numAffected, rawResponse ){
        if ( err )
            res.json( utils.createResult( false, err, "dbError" ) );

        else
            res.json( utils.createResult( true, rawResponse, "userRemoved" ) );
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

module.exports.getGroupsByUser = function( req, res ){
    var socket = sockets.getSocket( req.connection.remoteAddress );

    Group.find( { members : { $elemMatch : { user : req.user._id, approved : true } } }, { name: 1, _id: 1, image: 1 }, function( err, groups ){
        if( err )
            res.json( utils.createResult( false, err, "dbError" ) );

        else {
            _.each( groups, function( group ){
                if ( socket ){
                    socket.join( group._id );
                    console.log( sockets.getInstance().sockets.manager.rooms );
                }
            });

            res.json( utils.createResult( true, groups, "fetchGroupsByUser" ) );
        }
    });
};

module.exports.getGroupByName = function( req, res ){

    var groupName   = req.body.name;

    Group.findOne( { name: groupName } ).populate( "members.user" ).exec( function( err, group ) {

        if( err ){
            res.json( utils.createResult( false, err, "dbError" ) );
            return false;

        } else {
            group.posts = _.sortBy( group.posts, function( post ){
                return ( -1 ) * post.createdOn;
            });

            group.todos = _.sortBy( group.todos, function( todo ){
                return ( -1 ) * todo.createdOn;
            });

            group._doc.notApproved = [];
            _.each( group.members, function( member ){

                if( member.user._id == req.user._id && !member.approved ){
                    res.json( utils.createResult( false, null, "userNotApproved" ) );
                    return false;

                } else if( member.isAdmin ){

                    group._doc.adminID = member.user._id;
                }

                else if( !member.approved )
                    group._doc.notApproved.push( member.user._id );
            });

            res.json( utils.createResult( true, group, "fetchGroupByName" ) );
        }
    });
};

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
};

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
};

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
};

module.exports.makeGroup = function( req, res ) {
    var params  = req.body,
        user    = { user : req.user._id, isAdmin : true, approved : true };

    if( params.image == undefined || params.image == "" ){
        params.image = settings.defaultAvatar;
    }

    params.members = [ new UserInGroup( user ) ];

    validateGroupRequest( params, function( result ){
        if( result.result ){

            var group = new Group( params );
            group.save( function( err, group, count ){
                if( err )
                    res.json( utils.createResult( false, err, "dbError" ) );

                else
                    res.json( group );
            });

        } else
            res.json( result );

    });
};

module.exports.isGroupAdmin = function( req, res ) {
    var params = req.body;

    Group.findOne( { _id : params.group, members : { $elemMatch : { user : req.user._id, isAdmin : true } } }, function( err, group ){
        if ( err )
            res.json( Utils.createResult( false, err, "dbError" ) );

        else if ( group )
            res.json( utils.createResult( true, null, "isAdmin" ) );

        else
            res.json( utils.createResult( false, null, "notAdmin" ) );
    });
};

module.exports.isGroupExist = function( req, res ){
    isGroupExist( req.body.name, function( exist, group ){
        if( exist ){
            res.json( utils.createResult( false, group, "groupExist" ) );

        } else {
            res.json( utils.createResult( true, null, "groupNotExist" ) );
        }
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

var validateGroupRequest = function( params, callback ){

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
};

var isGroupExist = function( name, callback ) {
    Group.findOne({ name: name }, function( err, group ){
        callback( group != null, group );
    });
};