
var mongoose 	= require( 'mongoose'),
    Schema 		= mongoose.Schema;

var Group = new Schema({
    name     : 		String,
    createdOn: 		Date,
    image    :      String,
    address  : 		{ country: String, city: String, Street: String, House: Number, Apartment: Number }
});

mongoose.model( 'Group', Group );