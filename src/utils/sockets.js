
var conf        = require( '../settings/config' );

var socketsMap  = {},
    io          = {};

var connectMeters = function( client, ioClient ){

    client.on( 'connect', function( params ){

        var meterSocket = ioClient.connect( params.url );

        meterSocket.emit( 'connect', { username: params.username, password: params.password } );

        meterSocket.on( 'invalid', function( data ){
            client.emit( params.name + '-invalid', data );
            meterSocket.emit( 'close' );
        });

        meterSocket.on( 'data', function( data ){
            client.emit( params.name + '-data', data );
        });

        client.on( params.name + '-status', function( data ){
            meterSocket.emit( 'status', data );
        });

        client.on( params.name + '-update', function( data ){
            meterSocket.emit( 'update' );
        });

        client.on( params.name + '-close', function(){
            meterSocket.emit( 'close' );
            client.disconnect();
        });
    });
};

var connectNotifications = function( client ){

//    client.on( 'connect', function( params ){
//
//        var meterSocket = ioClient.connect( params.url );
//
//        meterSocket.emit( 'connect', { username: params.username, password: params.password } );
//
//        meterSocket.on( 'invalid', function( data ){
//            client.emit( params.name + '-invalid', data );
//            meterSocket.emit( 'close' );
//        });
//
//        meterSocket.on( 'data', function( data ){
//            client.emit( params.name + '-data', data );
//        });
//
//        client.on( params.name + '-status', function( data ){
//            meterSocket.emit( 'status', data );
//        });
//
//        client.on( params.name + '-update', function( data ){
//            meterSocket.emit( 'update' );
//        });
//
//        client.on( params.name + '-close', function(){
//            meterSocket.emit( 'close' );
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