
/**
 * Default configuration manager
 * Inject app and express reference
 */

module.exports = function(app, express, env) {

    // -- DEVELOPMENT
    if ('development' == env) {
        require("./development")(app, express);
    }

    // -- PRODUCTION
    if ('production' == env) {
        require("./production")(app, express);
    }

}

// -- Global settings
module.exports.settings = {
    'siteName'      : 'Goaa',
    'sessionSecret' : 'SDFsdf34dfffsdfFSfASDasd311ksevvf',
    'uri'           : 'http://localhost', // Without trailing /
    'port'          : process.env.PORT || 3000,
    'debug'         : 0,
    'profile'       : 0,
    'db'            : 'mongodb://goaa:goaa@dharma.mongohq.com:10039/Goaa',
    'S3Key'         : 'AKIAI2RZRVF5BVXASAUA',
    'S3Secret'      : '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',
    'S3Bucket'      : 'goaa',
    'S3ImagePrefix' : 'https://s3-eu-west-1.amazonaws.com/goaa'
}
