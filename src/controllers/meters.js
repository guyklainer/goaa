
var Mongoose    = require( 'mongoose' ),
    _           = require( 'underscore' ),
    Utils       = require( '../utils/utils' ),
    Crypto      = require( 'crypto' ),
    Group       = Mongoose.model( 'Group' );

module.exports.addMeter = function( req, res ){
    var params = req.body;

    if( !params.meter || !params.groupID )
        res.json( Utils.createResult( false, null, "missing params" ) );

    Group.findOne( { _id: params.groupID }, function( err, group ){

        if ( err )
            res.json( Utils.createResult( false, err, "dbError" ) );

        if( !group )
            res.json( Utils.createResult( false, null, "noGroupFound" ) );

        else {
            var idOfExist = isMeterNameExist( params.meter, group.meters );

            if( idOfExist && params.meter._id != idOfExist )
                res.json( Utils.createResult( false, null, "meterNameExist" ) );

            else {
                if( !params.meter._id ){
                    var timestamp = new Date().getTime();
                    params.meter._id = Crypto.randomBytes( 48 ).toString('hex') + timestamp;

                    group.meters.push( params.meter );
                    group.save( function( err ){

                        if( err ){
                            res.json( Utils.createResult( false, err, "dbError" ) );

                        } else {
                            res.json( Utils.createResult( true, null, "meterAdded" ) );
                        }
                    });

                } else {
                    updateMeter( params.meter, group, res );

                }
            }
        }
    });
};

module.exports.removeMeter = function( req, res ) {
    var params  = req.body;

    Group.findOne( { _id: params.groupID }, function( err, group ){

        if ( err ) {
            res.json(Utils.createResult( false, err, "dbError" ));
        }

        if( !group ){
            res.json(Utils.createResult( false, null, "noGroupFound" ));

        } else {
            var meters = group.meters;

            for( var i = 0; i < meters.length; i++ ){

                if ( meters[i]._id == params.meterID ){
                    meters.splice( i, 1 );
                    updateMeters( group._id, meters, res );
                    break;
                }
            }
        }
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

function updateMeters( groupID, meters, res ) {
    Group.update( { _id: groupID }, { $set: { meters: meters } }, function( err ){
        if( err ){
            res.json( Utils.createResult( false, err, "dbError" ) );
        } else {
            res.json( Utils.createResult( true, null, "metersUpdated" ) );
        }
    });
}

function updateMeter( newMeter, group, res ){
    var meterToDelete = -1;

    _.each( group.meters, function( meter, index ){

        if( meter._id == newMeter._id )
            meterToDelete = index;

    });

    group.meters.splice( meterToDelete, 1 );
    group.meters.push( newMeter );

    updateMeters( group._id, group.meters, res );
}