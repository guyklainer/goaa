
// -- Module dependencies.
var express     = require('express'),
    http        = require('http'),
    passport    = require('passport'),
    fs          = require('fs'),
    mongoose    = require('mongoose');

// -- Create Express instance and export
var app         = express(),
    env         = app.settings.env,
    
// -- Import configuration
    conf        = require('./settings/config'),
    settings    = conf.settings;
    conf        (app, express, env);

// -- Bootstrap models
var models_path = __dirname + '/models';
//require ( models_path + '/post.js');
fs.readdirSync( models_path ).forEach( function ( file ){
    require( models_path + '/' + file );
});

// -- Bootstrap Config
require('./settings/bootstrap').boot( app, passport );

// -- Routes
require('./settings/routes')( app, passport );

// -- Connect to DB
mongoose.connect( settings.db.main, function( err ){
    if( err ){
        mongoose.connect( settings.db.fallback, function( err ){
            if( err )
                console.log( "You probably working offline. Open your local mongodb server (mongod) and try again." );
        });
    }
});


// -- Create the server
var server      = http.createServer( app ),
    io          = require( 'socket.io' ).listen( server ),
    ioClient    = require( './node_modules/socket.io/node_modules/socket.io-client' );

var port = process.env.PORT || settings.port;
server.listen( port, function(){
    console.log("Express server listening on port %d in %s mode  //", settings.port, env);
    console.log('Using Express...');
});

// -- socket.io
require( './utils/sockets' ).connect( io, ioClient );
