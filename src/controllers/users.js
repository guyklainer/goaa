
var mongoose    = require( 'mongoose' ),
    Utils       = require( '../utils/utils' ),
    Mailer      = require( '../utils/mailer' ),
    _           = require( 'underscore'),
    crypto      = require( 'crypto'),
    User        = mongoose.model( 'User' );

module.exports.login = function( req, res ) {
    if( req.isAuthenticated() ) {
        User.update( { _id: req.user._id }, { $set: { lastVisited: new Date() }  }, function( err ){
            if( err )
                res.json( Utils.createResult( false, err, "dbError" ) );

            else
                res.json( { result: true, user: req.user } );
        });
    }
};

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

        var user        = new User( params );
        user.password   = params.password;

        validateSignupRequest( params, function( result ){
            if( result.result ){
                user.save( function( err, user, count ){
                    if( err )
                        result = Utils.createResult( false, err, "dbError" );

                    else {
                        result = Utils.createResult( true, user, "userSavedToDB" );
                        Mailer.send( user.email, "Welcome to Goaa", Mailer.buildWelcomeMessage( user ) );
                    }

                    res.json( result );
                });

            } else
                res.json( result );
        });

    } else
        res.json( Utils.createResult( false, {}, "passwordsNotEqual" ) );
};

module.exports.userExist = function( req, res ) {

    var username    = req.body.username;

    isUserExist( username, function( exist, user ){
        if( exist )
            res.json( Utils.createResult( true, user, "userExist" ) );

        else
            res.json( Utils.createResult( false, {}, "userNotExist" ) );
    });
};

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

            else if( !user )
                res.json( Utils.createResult( false, {}, "wrongUsername" ) );

            else {
                if( user.tempToken.expiredIn > now ) {
                    var passHash    = crypto.createHmac( 'sha1', user.salt ).update( password ).digest( 'hex' );

                    User.update( { _id: user._id }, { $set: { passwordHash: passHash, tempToken: {} }  }, function( err ){
                        if( err )
                            res.json( Utils.createResult( false, err, "dbError" ) );

                        else
                            res.json( Utils.createResult( true, {}, "passwordChanged" ) );
                    });

                } else
                    res.json( Utils.createResult( false, {}, "tokenExpired" ) );
            }
        });

    } else
        res.json( Utils.createResult( false, {}, "passwordNotEqual" ) );
};

module.exports.searchUser = function ( req, res ){
    var filter      = req.body.filter,
        pattern     = "^" + filter,
        exp         = new RegExp( pattern, "i" ),
        result      = {};

    if( filter == undefined || filter == "" ){
        res.json( utils.createResult( false, [], "emptyQuery" ) );

    } else {
        User.find( { username: exp }, { username: 1, _id: 0 }, function( err, docs ) {
            if ( err ){
                result = Utils.createResult( false, err, "dbError" );

            } else if( !docs || docs.length == 0 ) {
                result = Utils.createResult( false, [], "noResults" );

            } else {
                var usersArray = [];
                _.each( docs, function( doc ){
                    usersArray.push( doc.username );
                });

                result = Utils.createResult( true, usersArray, "foundUsers" );
            }

            res.json( result );
        });
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
            if( exist )
                Utils.createResult( false, user, "userExist" )

            callback( result );
        });

    } else
        callback( result );
}

function isUserExist( username, callback ) {
    User.findOne( { username: username }, function( err, user ){
        callback( user != null, user );
    });
}