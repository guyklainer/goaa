
/*
 * Routes
 */

var mongoose    = require('mongoose'),
    User        = mongoose.model('User'),
    passport    = require('passport');
    

module.exports = function(app) {

    app.get('/', function(req, res){

        res.render('home', { 
            title: 'Welcome To Goaa'
        });
    });

    app.get('/login', function( req, res ){
        res.render( 'login', { 
            title: "Goaa - Login"
        } );
    });

    app.post('/login',
        passport.authenticate('local'),
        function( req, res ) {
            res.redirect( '/' );
    });

    app.get('/signup', function( req, res ){
        res.render( 'signup', { 
            title: "Goaa - Signup"
        });
    });

    app.post('/signup', function( req, res ){
        if( req.body.password == req.body.confirm_password ) {
            
            var user = new User( req.body )
                .save( function( err, user, count ){
                    res.redirect( '/login' );
                });
        } else {
            res.render( 'signup', { 
                title: "Goaa - Signup", 
                model: res.body
            });
        }
    });

    /*
     * Errors
     */

     app.get('/404', function(req, res, next){
         next();
     });

     app.get('/403', function(req, res, next){
         var err = new Error('Not allowed!');
         err.status = 403;
         next(err);
     });

     app.get('/500', function(req, res, next){
         next(new Error());
     });

}
