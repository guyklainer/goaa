
var mongoose    = require('mongoose'),
    User        = mongoose.model('User'),
    index       = require('../controllers/index'),
    utils       = require('../utils/utils');

module.exports = function( app, passport ) {

    var users = require( '../controllers/users' );

    //*****************************
    // Home
    //*****************************
    app.get('/', index.home );
    app.get('/partials/:name', index.partials );


    //*****************************
    // Login & Signup
    //*****************************
//    app.get( '/login', users.login );
//    app.get( '/signup', users.signup );
//    app.get( '/logout', users.logout );
        
//    app.post( '/login', passport.authenticate( 'local', { successRedirect: '/', failureRedirect: '/login' } ) );
//    app.post( '/signup', users.makeSignup );


    //*****************************
    // API
    //*****************************
    app.post( '/api/validateUsername', users.validateUsername );

    //*****************************
    // Errors
    //*****************************
     app.get( '/404', index.e404 );
     app.get( '/403', index.e403 );
     app.get( '/500', index.e500 );

    //default route
    app.get('*', index.home );

}
