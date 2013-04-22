
module.exports.ensureAuthenticated = function( req, res, next )  {
    if( req.isAuthenticated() )
        return next();
    else
        res.redirect( '/login?auth=0' );
}

module.exports.isNullOrEmpty = function( obj ) {
	var keys = [];
	var key;
	if( typeof obj == "object" ){
        for( key in Object.keys( obj ) )
            keys.push( key );

        for( key in keys )
            if( key === "undefined" || key == "" || key === null )
                return { status: true, empty: key };

    } else {
        if( obj === "undefined" || obj == "" || obj === null )
            return { status: true, empty: obj };
    }

	return { status: false };
} 