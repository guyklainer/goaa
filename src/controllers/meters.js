
var io          = require( 'socket.io' ),
    Utils       = require( '../utils/utils' ),
    ioClient    = require( 'socket.io-client' ),
    Group       = mongoose.model('Group' );

module.exports.connect = function( req, res ){

    var meterName   = req.body.meter;

    Group.findOne({}, function( err, group ){
        if( err )
            res.json( Utils.createResult( false, err, "dbError" ) );

        else if( !group || !group.meters )
            res.json( Utils.createResult( false, null, "groupProblem" ) );

        else {
            _.each( group.meters, function( meter ){
                if( meter.name == meterName ){
                    connectToMeter( meter );

                    res.json( Utils.createResult( true, null, "meterConnected" ) );
                    return false;
                }
            });

            res.json( Utils.createResult( false, null, "noSuchMeter" ) );

        }
    });
}

function connectToMeter( meter ){
    // Connect to server


    _.each( clients, function( client ){
        client.on( 'connect', function( params ){

            var meterSocket = ioClient.connect( params.url );
            meterSocket.emit( 'connect', { username: params.username, password: params.password } );

            meterSocket.on( 'invalid', function( data ){
                client.emit( 'invalid', data );
                clients.splice( clients.indexOf( client ), 1 );
            });

            meterSocket.on( 'data', function( data ){
                client.emit( 'data', data );
            });
        });
    });

}
