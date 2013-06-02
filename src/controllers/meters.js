
module.exports.connect = function( io ) {
    io.sockets.on( 'connection', function( client ){

        client.on( 'connect', function( params ){

            var meterSocket = ioClient.connect( params.url );
            console.log(params);
            meterSocket.emit( 'connect', { username: params.username, password: params.password } );

            meterSocket.on( 'invalid', function( data ){
                client.emit( 'invalid', data );
                clients.splice( clients.indexOf( client ), 1 );
            });

            meterSocket.on( 'data', function( data ){
                client.emit( 'data', data );
            });

            client.on( 'status', function( data ){
                meterSocket.emit( 'status', data );
            });

            client.on( 'disconnect', function(){
                clients.splice( clients.indexOf( client ), 1 );
                meterSocket.emit( 'disconnect' );
            });
        });
    });
}