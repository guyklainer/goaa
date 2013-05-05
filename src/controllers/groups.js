
var mongoose    = require( 'mongoose' ),
    Group       = mongoose.model( 'Group' ),
    GroupUsers  = require( './groups-users' ),
    utils       = require( '../utils/utils');


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

    var params = req.body,
        result = {};

    params.createdOn = new Date();

    result = validateGroupRequest( params );

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

            } else {
                result = GroupUsers.createUserGroupConnection( req.user._id, group._id, true );

            }

            res.json( result );
        });

    } else {
        res.json( result );
    }
}

function validateGroupRequest ( params ){

    var result = utils.isAllFieldsAreNotNullOrEmpty( params );

    if( result.result ) {
        isGroupExist( params.name, function( exist, group ){
            if( exist ){
                result.result   = false;
                result.data     = group;
                result.msg      = "groupExist";
            }

            return result;
        });

    } else {
        return result;
    }


}

function isGroupExist( name, callback ) {
    Group.findOne({ name: name }, function( err, group ){
        callback( group != null );
    });
}

