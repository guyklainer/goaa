
var mongoose    = require( 'mongoose' ),
    GroupUser   = mongoose.model( 'GroupUser' ),
    Group       = mongoose.model( 'Group'),
    utils       = require( '../utils/utils' );

module.exports.createUserGroupConnection = function ( user, group, isAdmin ){
    var params = {},
        result = true;

    params.createdOn    = new Date();
    params.user         = user;
    params.group        = group;
    params.isAdmin      = isAdmin;

    var groupUser = new GroupUser( params );

    groupUser.save( function( err, group, count ){
        if( err ){
            result = false;
        }

        return result;
    });
}

module.exports.removeUserFromGroup = function ( user, group ){
    var result = true;

    GroupUser.remove( { group: group, user: user }, function( err ){
        if( err ){
            result = false;
        }

        checkIfGroupIsEmpty( group );

        return result;
    });
}

function checkIfGroupIsEmpty( group ){

    GroupUser.findOne( { group: group }, function( err, groupUser ){
        if ( err ) {
            //TODO
            return false;
        }

        if ( !groupUser ) {
            Group.remove({ group: group }, function( err ){
                if( err ){
                    //TODO
                    result = false;
                }

                return result;
            });
        }
    });
}
