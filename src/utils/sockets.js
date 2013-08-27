
var conf        = require( '../settings/config' );

var socketsMap  = {},
    io          = {};

var connectMeters = function( client, ioClient ){

    var meterSockets = [];
    
    client.on( 'connect', function( params ){
        if (params && params._id) {
            meterSockets[ params._id ] = ioClient.connect( params.url );

            meterSockets[ params._id ].emit( 'connect', params );

            meterSockets[ params._id ].on( 'invalid', function( data ){
                if (data) {
                    client.emit( 'invalid', data );
                    meterSockets[params._id].emit( 'close' );
                }
            });

            meterSockets[params._id].on( 'data', function( data ){
                if (data) {
                    client.emit( 'data', data );
                }
            });

            client.on( 'status', function( data ){
                if (data && data._id) {
                    meterSockets[data._id].emit( 'status', data.status );
                }
            });

            client.on( 'temp', function( data ){
                if (data && data._id) {
                    meterSockets[data._id].emit( 'temp', data.temp );
                }
            });

            client.on( 'update', function( data ){
                if (data && data._id) {
                    meterSockets[data._id].emit( 'update' );
                }
            });

            client.on( 'close', function( data ){
                if (data && data._id) {
                    meterSockets[data._id].emit( 'close' );
                    client.disconnect();
                }
            });
        }
    });
};

var connectNotifications = function( client ){

//    client.on( 'connect', function( params ){
//
//        var meterSockets = ioClient.connect( params.url );
//
//        meterSockets.emit( 'connect', { username: params.username, password: params.password } );
//
//        meterSockets.on( 'invalid', function( data ){
//            client.emit( params.name + '-invalid', data );
//            meterSockets.emit( 'close' );
//        });
//
//        meterSockets.on( 'data', function( data ){
//            client.emit( params.name + '-data', data );
//        });
//
//        client.on( params.name + '-status', function( data ){
//            meterSockets.emit( 'status', data );
//        });
//
//        client.on( params.name + '-update', function( data ){
//            meterSockets.emit( 'update' );
//        });
//
//        client.on( params.name + '-close', function(){
//            meterSockets.emit( 'close' );
//            client.disconnect();
//        });
//    });
};

module.exports.connect = function( ioParam, ioClient ){

    io = ioParam;

    io.set('authorization', function (data, accept) {
        data.unique = data.address.address;

        // accept the incoming connection
        accept(null, true);
    });

    io.sockets.on( 'connection', function( client ){
        socketsMap[ client.handshake.unique ] = client;

        connectMeters( client, ioClient );
        connectNotifications( client );
    });
};

module.exports.getSocket = function( unique ){
    return socketsMap[ unique ];
};

module.exports.getSockets = function(){
    return socketsMap;
};

module.exports.getInstance = function(){
    return io;
};