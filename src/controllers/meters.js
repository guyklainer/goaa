
var Mongoose    = require( 'mongoose' ),
    _           = require( 'underscore' ),
    Utils       = require( '../utils/utils' ),
    Crypto      = require( 'crypto' ),
    Group       = Mongoose.model( 'Group' );

module.exports.connect = function( io, ioClient ) {
    io.sockets.on( 'connection', function( client ){

        client.on( 'connect', function( params ){

            var meterSocket = ioClient.connect( params.url );
            console.log(meterSocket);

            meterSocket.emit( 'connect', { username: params.username, password: params.password } );

            meterSocket.on( 'invalid', function( data ){
                client.emit( 'invalid', data );
                meterSocket.emit( 'disconnect' );
            });

            meterSocket.on( 'data', function( data ){
                client.emit( 'data', data );
            });

            client.on( 'status', function( data ){
                meterSocket.emit( 'status', data );
            });

            client.on( 'disconnect', function(){
                meterSocket.emit( 'disconnect' );
            });
        });
    });
};

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
            if( isMeterNameExist( params.meter.name, group.meters ) )
                res.json( Utils.createResult( false, null, "meterNameExist" ) );

            else {
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
            if( isMeterNameExist( params.name, group.meters ) )
                res.json( Utils.createResult( true, null, "meterNameExist" ) );

            else
                res.json( Utils.createResult( false, null, "meterNameNotExist" ) );
        }
    });
};

function isMeterNameExist( name, meters ){
    var exist = false;

    _.each( meters, function( meter ){
        if( meter.name == name )
            exist = true;
    });

    return exist;
};

function updateMeters( groupID, meters, res ) {
    Group.update( { _id: groupID }, { $set: { meters: meters } }, function( err ){
        if( err ){
            res.json( Utils.createResult( false, err, "dbError" ) );
        } else {
            res.json( Utils.createResult( true, null, "metersUpdated" ) );
        }
    });
};