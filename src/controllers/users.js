
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

    var result = {},
        params = req.body;

    if( params.password == params.confirm_password
        && utils.isAllFieldsAreNotNullOrEmpty( params.password ).result ) {

        params.createdOn = new Date();
        var user = new User( params );
        user.password = params.password;

        result = validateSignupRequest( params );
        if( result.result ){
            user.save( function( err, user, count ){
                if( err ){
                    result.result   = false;
                    result.data     = err;
                    result.msg      = "userNotSavedToDB";

                } else {
                    result.data     = user;
                    result.msg      = "userSavedToDB";
                }
            });
        }

    } else {
        result.result   = false;
        result.msg      = "passwordsNotEqual";
    }

    res.json( result );
}

module.exports.userExist = function( req, res ) {

    var username    = req.body.username;
    var result      = { result: false, msg: "userNotExist" };

    isUserExist( username, function( msg, user ){
        if( msg ){
            result.result   = true;
            result.data     = user;
            result.msg      = "userExist";
        }

        res.json( result );
    });
}

function validateSignupRequest( params ) {
    var result = utils.isAllFieldsAreNotNullOrEmpty( params );

    if( result.result ) {
        isUserExist( params.username, function( msg, user ){
            if( msg ){
                result.result   = false;
                result.data     = user;
                result.msg      = "userExist";
            }
        });
    }

    return result;
}

function isUserExist( username, callback ) {
    User.findOne({ username: username }, function( err, user ){
        callback( user != null, user );
    });
}