
var mongoose    = require('mongoose'),
    index       = require('../controllers/index'),
    utils       = require('../utils/utils'),
    uploader    = require('../utils/uploader');

module.exports = function( app, passport ) {

    var users   = require( '../controllers/users'),
        groups  = require( '../controllers/groups'),
        posts   = require( '../controllers/posts');

    //*****************************
    // Home
    //*****************************
    app.get('/', index.home );
    app.get('/partials/:name', index.partials );


    //*****************************
    // Login & Signup
    //*****************************
    //app.get( '/login', users.login );
    app.post( '/logout', users.logout );
        
    app.post( '/login', passport.authenticate( 'local' ), users.login );
    app.post( '/signup', users.makeSignup );
    app.post( '/forgotpassword', users.forgotPassword );
    app.post( '/resetpassword', users.resetPassword );


    //*****************************
    // Groups
    //*****************************
    app.post( '/creategroup', groups.makeGroup );
    app.post( '/getgroups', groups.getGroupsByUser );

    //*****************************
    // Posts
    //*****************************
    app.post( '/addpost', posts.addPost );
    app.post( '/removepost', posts.removePost );

    //*****************************
    // API
    //*****************************
    app.post( '/api/validateUsername', users.userExist );
    app.post( '/api/upload', uploader.upload );

    //*****************************
    // Errors
    //*****************************
    app.get( '/404', index.e404 );
    app.get( '/403', index.e403 );
    app.get( '/500', index.e500 );

    //*****************************
    // Default route
    //*****************************
    app.get( '*', index.home );

}
