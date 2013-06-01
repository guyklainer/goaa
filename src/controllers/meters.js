
var io          = require( 'socket.io'),
    Utils       = require( '../utils/utils' ),
    ioClient    = require('socket.io-client'),
    Group       = mongoose.model('Group');

module.exports.connect = function( req, res ){

    var meterName   = req.body.meter,
        foundMeter  = false;

    Group.findOne({}, function( err, group ){
        if( err )
            res.json( Utils.createResult( false, err, "dbError" ) );

        else if( !group || !group.meters )
            res.json( Utils.createResult( false, null, "groupProblem" ) );

        else {
            _.each( group.meters, function( meter ){
                if( meter.name == meterName ){
                    connectToMeter( req, res, meter );
                    foundMeter = true;
                }
            });

            if( !foundMeter )
                res.json( Utils.createResult( false, null, "noSuchMeter" ) );

        }
    });
}

function connectToMeter( req, res, meter ){
    // Connect to server
    var meterSocket = ioClient.connect( meter.url );
    var uiSocket    = io.connect();

    meterSocket.emit( 'connect', { username: meter.username, password: meter.password } );

    meterSocket.on( 'invalid', function( data ){
        $scope.authError = data.field;
        log(data);
    });

    meterSocket.on( 'invalid', function( data ){
        $scope.authError = data.field;
        $scope.$apply();
        $scope.socket.emit( 'disconnect' );
        log(data);
    });

    meterSocket.on( 'boiler', function( boiler ){
        $scope.boiler = boiler;
        $scope.$apply();
    });
}
    // Connect to server
    var meterSocket = ioClient.connect( 'localhost:8080', {reconnect: true} );

    console.log('2');

// Add a connect listener
    socket.on('connect', function(socket) {
        console.log('Connected!');
    });

}