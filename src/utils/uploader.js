var fs      = require( 'fs' ),
    config  = require( '../settings/config'),
    utils   = require( './utils'),
    knox    = require( 'knox' ),
    path    = require( 'path' ),
    os      = require( 'os' );

var S3Credentials = {
    key     : config.settings.S3Key,
    secret  : config.settings.S3Secret,
    bucket  : config.settings.S3Bucket
};

module.exports.upload = function( req, res ){
    var folder;

    if( req.body.stage == "newGroup" )
        folder = 'groups';

    else if( req.body.stage == "posts" && req.body.group )
        folder = 'posts/' + req.body.group;

    else
        folder = req.user ? req.user.username : 'tmp';

    var filename = path.basename(req.files.image.path);

    res.json( { result: true, data: { imgURL: '/uploads/' + folder + filename }, msg: "imageSaved" } );

//    fs.readFile( req.files.image.path, { encoding : 'binary' }, function( err, data ){
//
//        if( data.length > 3000000 )
//            res.json( { result: false, msg: "tooBig" } );
//
//        else if( !utils.isImage( req.files.image.name ) )
//            res.json( { result: false, msg: "notImage" } );
//
//        else
//            //saveImage( req, res );
////        pushToS3( req.files.image.name, utils.getExtension( req.files.image.name ), data.length, req.files.image.path, req.files.image.type, folder, function( err, imageURL ){
////            if ( err )
////                res.json( { result: false, data: err, msg: "S3Problem" } );
////
////            else
////                res.json( { result: true, data: { imgURL: config.settings.S3ImagePrefix + imageURL }, msg: "imageSaved" } );
////        });
//
//    });
};

function saveImage( req, res ){

    var tempPath    = req.files.image.path,
        targetPath  = path.resolve('./uploads/image.png');
    if (path.extname(req.files.image.name).toLowerCase() === '.png') {
        fs.rename(tempPath, targetPath, function(err) {
            if (err) throw err;
            console.log("Upload completed!");
        });
    } else {
        fs.unlink(tempPath, function () {
            if (err) throw err;
            console.error("Only .png files are allowed!");
        });
    }
}

function pushToS3( fileName, extension, fileLength, filePath, type, folder, callback ) {
    var client  = knox.createClient( S3Credentials),
        newName = new Date().getTime() + "." + extension;

    var headers = {
        'Content-Type': type,
        'Content-Length': fileLength
    };

    var fileStream = fs.createReadStream( filePath );

    var uploadStream = client.putStream( fileStream, '/' + folder + '/' + newName, headers, function( err, res ){
        if ( err )
            return callback( err );

        // remove the file after successful upload
        //fs.unlink( tempDir + fileName );

        console.log( fileName + ' uploaded' );
        callback( err, '/' + folder + '/' + newName );
    });

    uploadStream.on( 'progress', function( status ){
        console.log( status );
        // example of status: { percent: 70, written: 327680, total: 465974 }
    });
}

