
var mongoose    = require( 'mongoose' ),
    GroupUsers  = require( './groups-users' ),
    utils       = require( '../utils/utils'),
    Group       = mongoose.model( 'Group' );

module.exports.joinGroup = function( req, res ){
    var params = req.body;

    GroupUsers.createUserGroupConnection( params.user, params.group, false, function( result ){
        res.json( result );
    });
}

module.exports.getGroupsByUser = function( req, res ){
    var userID  = req.body.userID,
        result;

    GroupUsers.find( { user: userID }, { group: 1, _id: 0 }, function( err, groupIDs ){
        if( err )
            result = utils.createResult( false, err, "dbError" );

        else {
            _.each( groupIDs, function( groupID ){
                Group.find( { _id: groupID }, function( err, groups ){

                    if( err ){
                        result = utils.createResult( false, err, "dbError" );
                        return false;

                    } else
                        result = utils.createResult( true, groups, "fetchGroupsByUser" );
                });
            });
        }

        res.json( result );
    });
}

module.exports.searchGroup = function ( req, res ){
    var groupName   = req.body.groupName,
        result      = {};

    Group.find( { name: new RegExp( '^' + groupName, "i" ) }, function( err, docs ) {
        if ( err ){
            result.result   = false;
            result.data     = err;
            result.msg      = "dbError";

        } else {
            result.result   = true;
            result.data     = docs;
            result.msg      = "foundGroups";
        }

        res.json( result );
    });
}

module.exports.editGroup = function( req, res ) {
    var params      = req.body,
        result      = {},
        groupID     = params.groupID;

    Group.update(
        { _id: groupID },

        { $set: {
            "address.country"   : params.country,
            "address.city"      : params.city,
            "address.street"    : params.street,
            "address.house"     : params.house,
            "address.apartment" : params.apartment
        } },

        { upsert: true },

        function( err ){
            if ( err ) {
                result.result   = false;
                result.data     = err;
                result.msg      = "errorInUpdate";

            } else {
                result.result   = true;
                result.data     = null;
                result.msg      = "addressUpdated";
            }
        }
    );
}

module.exports.makeGroup = function( req, res ) {

    var params = req.body;

    params.createdOn = new Date();

    validateGroupRequest( params, function( result ){
        if( result.result ){
            params.address.country      = params.country;
            params.address.city         = params.city;
            params.address.street       = params.street;
            params.address.house        = params.house;
            params.address.apartment    = params.apartment;

            delete params.country;
            delete params.city;
            delete params.street;
            delete params.house;
            delete params.apartment;

            var group = new Group( params );
            group.save( function( err, group, count ){
                if( err ){
                    result.result   = false;
                    result.data     = err;
                    result.msg      = "groupNotSavedToDB";

                    res.json( result );

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

function validateGroupRequest ( params, callback ){

    var result = utils.isAllFieldsAreNotNullOrEmpty( params );

    if( result.result ) {
        isGroupExist( params.name, function( exist, group ){
            if( exist ){
                result.result   = false;
                result.data     = group;
                result.msg      = "groupExist";
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

