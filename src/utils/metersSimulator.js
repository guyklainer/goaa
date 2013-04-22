
var cronJob = require( 'cron' ).CronJob;

module.exports.startSimulator = function() {

    var job = new cronJob({
        cronTime: "*/1 * * * *", // Runs every minute

        onTick: function() {
            console.log( 'check boiler' );
        },

        start: true //Start the job right now
    });
}