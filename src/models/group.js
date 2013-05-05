
var mongoose 	= require( 'mongoose' ),
    Schema 		= mongoose.Schema;

var Group = new Schema({
    name     : 		String,
    createdOn: 		Date,
    address  : 		{ country: String, city: String, Street: String, House: Number, Apartment: Number },
    image    :      String
});

mongoose.model( 'Group', Group );