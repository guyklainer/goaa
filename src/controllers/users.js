
var mongoose    = require( 'mongoose' ),
    User        = mongoose.model('User'),
    utils       = require('../utils/utils');

module.exports.login = function( req, res ) {
    if( req.isAuthenticated() )
        res.redirect( '/profile' );
    else
        res.render( 'login', {
            title: "Goaa - Login"
        });
}

module.exports.signup = function( req, res ) {
    res.render( 'signup', {
        title: "Goaa - Signup"
    });
}

module.exports.logout = function( req, res ) {
    req.logout();
    res.redirect( '/login' );
}

module.exports.makeSignup = function( req, res ) {
    var result = {
        result: true,
        isUsernameValid: true,
        isPasswordValid: true
    };

    if( req.body.password == req.body.confirm_password
        && !utils.isNullOrEmpty( req.body.password ).status ) {

        var user = new User( req.body );
        user.password = req.body.password;

        result = validateSignupRequest( req.body );
        if( result.result ){ 
            user.save( function( err, user, count ){
                if( err ){
                    result.result = false;
                }
            });
        }

    } else {
        result.isPasswordValid = false;
        result.result = false;
    }

    res.json( result );
}

module.exports.userExist = function( req, res ) {

    var username = req.body.username;
    var result = { result: false };

    isUserExist( username, function( msg ){
        if( msg ){
            result.result = true;
        }

        res.json( result );
    });
}

function validateSignupRequest( params ) {
    var result = {
        result: true,
        isUsernameValid: true,
        isPasswordValid: true
    };

    if( !utils.isNullOrEmpty( params ).status ) {
        isUserExist( params.username, function( msg ){
            if( msg ){
                result.result = false;
                result.isUsernameValid = false;
            }
        });


    } else {
        result.result = false;
    }

    return result;
}

function isUserExist( username, callback ) {
    User.findOne({ username: username }, function( err, user ){
        callback( user != null );
    });
}