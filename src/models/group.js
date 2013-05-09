
var mongoose 	= require( 'mongoose'),
    Schema 		= mongoose.Schema;

var Group = new Schema({
    name     : 		String,
    createdOn: 		Date,
    image    :      String,
    address  : 		{ country: String, city: String, street: String, house: Number, apartment: Number }
});

mongoose.model( 'Group', Group );