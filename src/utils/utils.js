
module.exports.ensureAuthenticated = function( req, res, next )  {
    if( req.isAuthenticated() )
        return next();
    else
        res.redirect( '/login?auth=0' );
}

module.exports.isNullOrEmpty = function( obj ) {
	var keys = [];
	var key;
	
	for( key in Object.keys( obj ) )
		keys.push( key );

	for( key in keys )
		if( key === "undefined" || key == "" || key === null )
			return { status: true, empty: key };
	console.log(obj);
	return { status: false };
} 