
module.exports.home = function( req, res ) {
    res.cookie( 'user', req.isAuthenticated() ? req.user : null );

    res.render( 'index', {
        title   : 'Goaa',
        user    : req.isAuthenticated() ? req.user : null
    });
}

module.exports.partials = function( req, res ) {
    var name = req.params.name;
    res.cookie('user', req.isAuthenticated() ? req.user : null);

    res.render( 'partials/' + name, {
        user: req.isAuthenticated() ? req.user : null
    });
}

module.exports.e404 = function( req, res, next ) {
    next();
}

module.exports.e403 = function( req, res, next ) {
    var err         = new Error( 'Not allowed!' );
        err.status  = 403;

    next( err );
}

module.exports.e500 = function( req, res, next ) {
    next( new Error() );
}