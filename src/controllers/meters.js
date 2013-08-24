
var Mongoose    = require( 'mongoose' ),
    _           = require( 'underscore' ),
    Utils       = require( '../utils/utils' ),
    Group       = Mongoose.model( 'Group'),
    Meter       = Mongoose.model( 'Meter' );

module.exports.addMeter = function( req, res ) {
    var params      = req.body,
        meter       = {},
        insertQuery = {},
        selectQuery = { _id : params.groupID };

    if( params.meter._id && params.meter._id != "" ) {

        selectQuery[ "meters._id" ] = params.meter._id;
        insertQuery = { $set : { "meters.$" : params.meter } };

    } else {
        meter = new Meter( params.meter );
        insertQuery = { $push: { "meters": meter } };
    }

    Group.update( selectQuery, insertQuery, function( err, numAffected, rawResponse ){
        if ( err )
            res.json( Utils.createResult( false, err, "dbError" ) );

        else
            res.json( Utils.createResult( true, rawResponse, "meterAdded" ) );
    });
};

module.exports.removeMeter = function( req, res ) {
    var params  = req.body;

    Group.update( { _id: params.groupID }, { $pull : { "meters" :  { _id : params.meterID } } }, function( err, numAffected, rawResponse ) {
        if ( err )
            res.json( Utils.createResult( false, err, "dbError" ) );

        else
            res.json( Utils.createResult( true, rawResponse, "meterRemoved" ) );
    });
};

module.exports.isMeterNameExist = function( req, res ){
    var params = req.body;

    if( !params.name || !params.groupID )
        res.json( Utils.createResult( false, null, "missing params" ) );

    Group.findOne( { _id: params.groupID }, function( err, group ){
        if ( err )
            res.json( Utils.createResult( false, err, "dbError" ) );

        if( !group )
            res.json( Utils.createResult( false, null, "noGroupFound" ) );

        else {
            if( isMeterNameExist( params, group.meters ) )
                res.json( Utils.createResult( true, null, "meterNameExist" ) );

            else
                res.json( Utils.createResult( false, null, "meterNameNotExist" ) );
        }
    });
};

function isMeterNameExist( meterToCheck, meters ){
    var exist = false;

    _.each( meters, function( meter ){
        if( meter.name == meterToCheck.name )
            exist = meter._id;
    });

    return exist;
}