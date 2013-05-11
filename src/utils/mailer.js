var nodemailer  = require( "nodemailer" ),
    Utils       = require( './utils'),
    config      = require( '../settings/config'),
    settings    = config.settings;

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport( "SMTP",{
    service: "Gmail",
    auth: {
        user: "goaa.team@gmail.com",
        pass: "goaa1234"
    }
});

module.exports.send = function( to, subject, message, callback ){
    var mailOptions = {
        from    : "Goaa <goaa.team@gmail.com>", // sender address
        to      : to,                           // list of receivers - "bar@blurdybloop.com, baz@blurdybloop.com"
        subject : subject,
        html    : message                       // html body
    };

    // send mail with defined transport object
    smtpTransport.sendMail( mailOptions, function( err, res ){
        var result;
        if( err ) {
            result = Utils.createResult( false, err, "mailSendFailed" );

        } else {
            result = Utils.createResult( true, res, "mailSent" );
        }

        smtpTransport.close(); // shut down the connection pool, no more messages
        if( callback )
            callback( result );
    });
}

module.exports.buildWelcomeMessage = function( user ){
    var msg = "";

    msg += "<p>Welcome " + user.firstName + ",</p>";

    return msg;
}

module.exports.buildForgotPasswordMessage = function( tokenObj ){
    var msg = "";

    msg += '<a href=' + settings.productionURI + '/resetpassword?token=' + tokenObj.token + '>Click this link to reset your password</a>';

    return msg;
}