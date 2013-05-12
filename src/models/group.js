
var mongoose 	= require( 'mongoose' ),
    Schema 		= mongoose.Schema,
    Post 	    = mongoose.model( 'Post' );

var Group = new Schema({
    name     : 		String,
    createdOn: 		Date,
    address  : 		{ country: String, city: String, Street: String, House: Number, Apartment: Number },
    image    :      String,
    posts    :      [Post]
});

mongoose.model( 'Group', Group );