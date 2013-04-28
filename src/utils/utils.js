
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

module.exports.isImage = function( filename ) {
    var ext = getExtension( filename );
    switch ( ext.toLowerCase() ) {
        case 'jpg':
        case 'gif':
        case 'bmp':
        case 'png':
            //etc
            return true;
    }
    return false;
}

function getExtension( filename ) {
    var parts = filename.split( '.' );
    return parts[parts.length - 1];
}

