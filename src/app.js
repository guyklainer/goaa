
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
fs.readdirSync( models_path ).forEach( function ( file ){
    require( models_path + '/' + file );
});

// -- Bootstrap Config
require('./settings/bootstrap').boot( app, passport );

// -- Routes
require('./settings/routes')( app, passport );

// -- Connect to DB
mongoose.connect( settings.db );

// -- Only listen on $ node app.js
logo.print();

http.createServer( app ).listen( settings.port, function(){
    console.log("Express server listening on "+" port %d ".bold.inverse.red+" in " + " %s mode ".bold.inverse.green + " //", settings.port, env);
    console.log('Using Express %s...', express.version.red.bold);
});
