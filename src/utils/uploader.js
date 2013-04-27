var Imager          = require( 'imager' )
    imagerConfig    = require('../settings/imager-config.js'),
    imager          = new Imager( imagerConfig, 'S3' );

module.exports.upload = function( req, res ){
    imager.upload([req.files.image], function( err, cdnUri, files ){
        console.log(err);
        console.log(cdnUri);
        console.log(files);
    }, 'items');
}