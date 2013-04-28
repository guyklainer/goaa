
var cronJob     = require( 'cron' ).CronJob,
    mongoose    = require( 'mongoose' ),
    _           = require( 'underscore'),
    Meter       = mongoose.model('Meter');

module.exports.startSimulator = function() {

    var job = new cronJob({
        cronTime: "*/2 * * * *", // Runs every 2 minutes

        onTick: function() {
            updateBoilers();
        },

        start: true //Start the job right now
    });
}

var updateBoilers = function(){
    Meter.find({ meterName: "Boiler" }, function(err, docs){

        _.each( docs, function( doc ){
            if ( doc.status == "on" && doc.data < 60 ){
                doc.data++;
            }else if( doc.status == 'off' && doc.data > 20 ){
                doc.data--;
            }

            Meter.update( { _id: doc._id }, { $set: { data: doc.data } }, function( err ){
                //TODO send new status to client
            });
        });
    });

}