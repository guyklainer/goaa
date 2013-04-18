
module.exports.home = function( req, res ) {
    res.render('index', {
        title: 'Goaa'
    });
}

module.exports.partials = function( req, res ) {
    var name = req.params.name;
    res.render('partials/' + name);

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