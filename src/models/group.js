
var mongoose 	= require( 'mongoose' ),
    Schema 		= mongoose.Schema,
    settings    = require( '../settings/config' ).settings;

var Group = new Schema({
    groupName: 		String,
    createdOn: 		Date,
    address  : 		{ city: String, Street: String, House: Number, Apartment: Number },
    image    :      String
});

mongoose.model( 'Group', Group );