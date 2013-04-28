var fs      = require( 'fs' ),
    config  = require( '../settings/config'),
    utils   = require( './utils'),
    knox    = require( 'knox'),
    path    = require('path'),
    os      = require('os'),
    tempDir = path.normalize( os.tmpDir() + path.sep );

var S3Credentials = {
    key     : config.settings.S3Key,
    secret  : config.settings.S3Secret,
    bucket  : config.settings.S3Bucket
};

module.exports.upload = function( req, res ){
    var user = req.user ? req.user.username : 'tmp';

    fs.readFile( req.files.image.path, function( err, data ){
        if( data.length > 1000000 )
            res.json( { success: false, error: "Size limit is 1MB" } );

        else if( !utils.isImage( req.files.image.name ) )
            res.json( { success: false, error: "Only images allowed" } );

        else
        pushToS3( req.files.image.name, data.length, req.files.image.path, req.files.image.type, user, function( err, imageURL ){
            if ( err )
                res.json( { success: false, error: "err" } );

            else
                res.json( { success: true, data: config.settings.S3ImagePrefix + imageURL } );
        });

    });
}

function pushToS3( fileName, fileLength, filePath, type, user, callback ) {
    var client = knox.createClient( S3Credentials );

    var headers = {
        'Content-Type': type,
        'Content-Length': fileLength
    };

    var fileStream = fs.createReadStream( filePath );

    var uploadStream = client.putStream( fileStream, '/' + user + '/' + fileName, headers, function( err, res ){
        if ( err )
            return callback( err );

        // remove the file after successful upload
        fs.unlink( tempDir + fileName );

        console.log( fileName + ' uploaded' );
        callback( err, '/' + user + '/' + fileName );
    });

    uploadStream.on( 'progress', function( status ){
        console.log( status );
        // example of status: { percent: 70, written: 327680, total: 465974 }
    });
}

