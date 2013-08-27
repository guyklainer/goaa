
var _ = require( 'underscore' );

module.exports.ensureAuthenticated = function( req, res, next )  {
    if( req.isAuthenticated() ){
        res.cookie('user', req.user );
        return next();
    }

    else {
        res.cookie( 'user', null );
        res.send( '401', "Unauthorized" );
    }

};

module.exports.isAllFieldsAreNotNullOrEmpty = function( obj ) {
    var returnKeys  = {};
    var success     = true;
    var key;

	if( typeof obj == "object" ){
        var keys = _.keys( obj );

        _.each( keys, function( key ){
            if( obj[ key ] === "undefined" || obj[ key ] == "" || obj[ key ] === null || ( obj[ key ] && obj[ key ].length === 0 ) ) {
                returnKeys[ key ]   = false;
                success             = false;

            } else {
                returnKeys[ key ] = true;
            }
        });

    } else {
        if( obj === "undefined" || obj == "" || obj === null ){
            returnKeys[ obj ]   = false;
            success             = false;
        }
    }

	return { result: success, data: returnKeys, msg: success ? "fullFields" : "emptyFields" };
};

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
};

module.exports.createResult = function( result, data, msg ) {
    return { result: result, data: data, msg: msg };
};

var getExtension = module.exports.getExtension = function( filename ) {
    var parts = filename.split( '.' );
    return parts[parts.length - 1];
};



