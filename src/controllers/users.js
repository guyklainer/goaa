
var mongoose    = require( 'mongoose' ),
    User        = mongoose.model('User');

module.exports.login = function( req, res ) {
    res.render( 'login', {
        title: "Goaa - Login"
    });
}

module.exports.signup = function( req, res ) {
    res.render( 'signup', {
        title: "Goaa - Signup"
    });
}

module.exports.makeSignup = function( req, res ) {
    if( req.body.passwordHash == req.body.confirm_password ) {

        var user = new User( req.body );
        user.password = req.body.passwordHash;
        user.save( function( err, user, count ){
            res.redirect( '/login' );
        });
    } else {
        res.render( 'signup', {
            title: "Goaa - Signup",
            model: res.body
        });
    }
}