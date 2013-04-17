
module.exports.home = function( req, res ) {
    res.render('home', {
        title: 'Welcome To Goaa'
    });
}

module.exports.e404 = function( req, res, next ) {
    next();
}

module.exports.e403 = function( req, res, next ) {
    var err = new Error( 'Not allowed!' );
    err.status = 403;
    next( err );
}

module.exports.e500 = function( req, res, next ) {
    next( new Error() );
}