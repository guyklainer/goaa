
// -- Module dependencies.
var express     = require('express'),
    http        = require('http'),
    logo        = require('./lib/logo'),
    color       = require('colors'),
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

// -- Only listen on $ node app.js
logo.print();

// -- Create the server
var server      = http.createServer( app ),
    io          = require( 'socket.io' ).listen( server ),
    ioClient    = require( './node_modules/socket.io/node_modules/socket.io-client' );

server.listen( settings.port, function(){
    console.log("Express server listening on "+" port %d ".bold.inverse.red+" in " + " %s mode ".bold.inverse.green + " //", settings.port, env);
    console.log('Using Express %s...', express.version.red.bold);
});

// -- socket.io
require( './utils/sockets' ).connect( io, ioClient );
