
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
    'productionURI' : 'ec2-54-246-47-98.eu-west-1.compute.amazonaws.com',
    'port'          : process.env.PORT || 3000,
    'debug'         : 0,
    'profile'       : 0,
    'db'            : { main: 'mongodb://goaa:goaa@dharma.mongohq.com:10039/Goaa', fallback: 'mongodb://localhost/goaa' },
    'defaultAvatar' : '/img/logo.png'
}
