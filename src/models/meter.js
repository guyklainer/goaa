
var mongoose 	= require( 'mongoose' ),
    Schema 		= mongoose.Schema;

var Meter = new Schema({
    meterName: 		String,
    groupID:        Number,
    data:           Number,
    status:         String,
    createdOn: 		Date
});

mongoose.model( 'Meter', Meter );