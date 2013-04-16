
/*
 * Routes
 */

var mongoose    = require('mongoose'),
    User        = mongoose.model('User');

module.exports = function( app, passport ) {

    var users = require( '../controllers/users' );

    app.get('/', function(req, res){

        res.render('home', { 
            title: 'Welcome To Goaa'
        });
    });

    app.get( '/login', users.login );
    app.post( '/login', passport.authenticate( 'local', { successRedirect: '/', failureRedirect: '/login' } ) );

    app.get( '/signup', users.signup );
    app.post('/signup', users.makeSignup );

    /*
     * Errors
     */

     app.get( '/404', function( req, res, next ){
         next();
     });

     app.get( '/403', function( req, res, next ){
         var err = new Error( 'Not allowed!' );
         err.status = 403;
         next( err );
     });

     app.get( '/500', function(req, res, next ){
         next( new Error() );
     });

}

function ensureAuthenticated( req, res, next ) {
    if( req.isAuthenticated() )
        return next();
    else
        res.redirect('/');
}
