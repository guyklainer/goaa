
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
    'siteName' : 'Goaa',
    'sessionSecret' : 'SDFsdf34dfffsdfFSfASDasd311ksevvf',
    'uri' : 'http://localhost', // Without trailing /
    'port' : process.env.PORT || 3000,
    'debug' : 0,
    'profile' : 0,
    'db' : 'mongodb://goaa:goaa@dharma.mongohq.com:10039/Goaa'
}

