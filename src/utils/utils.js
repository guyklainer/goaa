
module.exports.ensureAuthenticated = function( req, res, next )  {
    if( req.isAuthenticated() )
        return next();
    else
        res.redirect( '/login?auth=0' );
}

module.exports.isAllFieldsAreNotNullOrEmpty = function( obj ) {
	var keys        = [];
    var returnKeys  = {};
    var success     = true;
    var key;

	if( typeof obj == "object" ){
        for( key in Object.keys( obj ) )
            keys.push( key );

        for( key in keys ){
            if( key === "undefined" || key == "" || key === null ) {
                returnKeys[ key ] = false;
                success = false;

            } else {
                returnKeys[ key ] = true;
            }
        }

    } else {
        if( obj === "undefined" || obj == "" || obj === null ){
            returnKeys[ obj ]   = false;
            success             = false;
        }
    }

	return { result: success, data: returnKeys, msg: success ? "fullFields" : "emptyFields" };
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

module.exports.createResult = function( result, data, msg ) {
    return { result: result, data: data, msg: msg };
}

function getExtension( filename ) {
    var parts = filename.split( '.' );
    return parts[parts.length - 1];
}



