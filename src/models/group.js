
var mongoose 	= require( 'mongoose' ),
    Meter       = mongoose.model( 'Meter' ),
    Schema 		= mongoose.Schema;

var Group = new Schema({
    name     : 		String,
    createdOn: 		Date,
    image    :      String,
    address  : 		{ country: String, city: String, Street: String, House: Number, Apartment: Number },
    meters   :      [ Meter ]
});

mongoose.model( 'Group', Group );