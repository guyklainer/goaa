
var mongoose    = require( 'mongoose' ),
    User        = mongoose.model('User' ),
    Utils       = require('../utils/utils' ),
    Mailer      = require( '../utils/mailer'),
    crypto      = require( 'crypto' );

module.exports.login = function( req, res ) {
    if( req.isAuthenticated() ) {
        res.json( { result: true, user: req.user } );
    }
}

module.exports.signup = function( req, res ) {
    res.render( 'signup', {
        title: "Goaa - Signup"
    });
}

module.exports.logout = function( req, res ) {
    console.log("logout");
    req.logout();
    res.json( { result: true } );
//    res.redirect( '/login' );
}

module.exports.makeSignup = function( req, res ) {

    var result = {},
        params = req.body;

    if( params.password == params.confirm_password
        && Utils.isAllFieldsAreNotNullOrEmpty( params.password ).result ) {

        params.createdOn = new Date();
        var user = new User( params );
        user.password = params.password;

        validateSignupRequest( params, function( result ){
            if( result.result ){
                user.save( function( err, user, count ){
                    if( err ){
                        result.result   = false;
                        result.data     = err;
                        result.msg      = "userNotSavedToDB";

                    } else {
                        result.data     = user;
                        result.msg      = "userSavedToDB";
                        Mailer.send( user.email, "Welcome to Goaa", Mailer.buildWelcomeMessage( user ) );
                    }

                    res.json( result );
                });

            } else {
                res.json( result );

            }
        });


    } else {
        result.result   = false;
        result.msg      = "passwordsNotEqual";

        res.json( result );
    }
}

module.exports.userExist = function( req, res ) {

    var username    = req.body.username;
    var result      = { result: false, msg: "userNotExist" };

    isUserExist( username, function( exist, user ){
        if( exist ){
            result.result   = true;
            result.data     = user;
            result.msg      = "userExist";
        }

        res.json( result );
    });
}

module.exports.forgotPassword = function( req, res ) {
    var username    = req.body.username,
        now         = new Date();

    User.findOne( { username: username }, function( err, user ){
        if( err )
            res.json( Utils.createResult( false, err, "dbError" ) );

        else {
            if( user && ( !user.tempToken.expiredIn || user.tempToken.expiredIn < now ) ){
                sendResetPasswordMail( user, function( result ){
                    res.json( result );
                });

            } else if( user ) {
                res.json( Utils.createResult( false, {}, "haveValidToken" ) );

            } else {
                res.json( Utils.createResult( false, {}, "userNotExist" ) );
            }

        }
    });
}

module.exports.resetPassword = function( req, res ) {
    var username        = req.body.username,
        token           = req.body.token,
        password        = req.body.password,
        passwordConfirm = req.body.confirm_password,
        now             = new Date();

    if( password == passwordConfirm && Utils.isAllFieldsAreNotNullOrEmpty( password ).result ) {

        User.findOne( { username: username, "tempToken.token": token }, function( err, user ){
            if( err )
                res.json( Utils.createResult( false, err, "dbError" ) );

            else {
                if( user ){
                    if( user.tempToken.expiredIn > now ) {
                        var passHash    = crypto.createHmac( 'sha1', user.salt ).update( password ).digest( 'hex' );

                        User.update( { _id: user._id }, { $set: { passwordHash: passHash, tempToken: {} }  }, function( err ){
                            if( err )
                                res.json( Utils.createResult( false, err, "dbError" ) );

                            else
                                res.json( Utils.createResult( true, {}, "passwordChanged" ) );
                        });

                    } else {
                        res.json( Utils.createResult( false, {}, "tokenExpired" ) );
                    }

                } else {
                    res.json( Utils.createResult( false, {}, "wrongUsername" ) );
                }

            }
        });

    } else {

        res.json( Utils.createResult( false, {}, "passwordNotEqual" ) );
    }
}

function sendResetPasswordMail( user, callback ){
    var subject     = "Goaa - Reset your password",
        newToken    = {
            expiredIn   :   new Date().getTime() + ( 48 * 60 * 60 * 1000 ), // 2 days
            token       :   crypto.randomBytes( 48 ).toString('hex')
        };

    User.update( { _id: user._id }, { $set: { tempToken: newToken } }, { upsert: 1 }, function( err ){
        if( err )
            callback( Utils.createResult( false, err, "dbError" ) );

        else {
            Mailer.send( user.email, subject, Mailer.buildForgotPasswordMessage( newToken ), function( result ){
                callback( result );
            });
        }
    });
}

function validateSignupRequest( params, callback ) {
    var result = Utils.isAllFieldsAreNotNullOrEmpty( params );

    if( result.result ) {
        isUserExist( params.username, function( exist, user ){
            if( exist ){
                result.result   = false;
                result.data     = user;
                result.msg      = "userExist";
            }

            callback( result );
        });

    } else {
        callback( result );
    }
}

function isUserExist( username, callback ) {
    User.findOne( { username: username }, function( err, user ){
        callback( user != null, user );
    });
}