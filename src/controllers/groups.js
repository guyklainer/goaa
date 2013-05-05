
var mongoose    = require( 'mongoose' ),
    Group        = mongoose.model( 'Group' ),
    utils       = require( '../utils/utils' );

module.exports.makeGroup = function( req, res ) {

    var params = req.body,
        result = {};

    params.createdOn = new Date();
    var group = new Group( params );

    result = validateGroupRequest( params );
    if( result.result ){
        group.save( function( err, group, count ){
            if( err ){
                result.result = false;
                result.data     = err;
                result.msg      = "groupNotSavedToDB";
            } else {
                result.data     = group;
                result.msg      = "groupSavedToDB";
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