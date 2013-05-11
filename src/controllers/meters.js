
var io          = require( 'socket.io'),
    utils       = require( '../utils/utils' ),
    Meter       = mongoose.model('Meter');

module.exports.getMeter = function( req, res ){
    var meterID = req.body.meterID;

}