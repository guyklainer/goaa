
var mongoose 	= require( 'mongoose' ),
    postModel   = require ( './post' ),
    Schema 		= mongoose.Schema,
    Post 	    = mongoose.model( 'Post' );

var Group = new Schema({
    name     : 		String,
    createdOn: 		Date,
    image    :      String,
    address  : 		{ country: String, city: String, street: String, house: Number, apartment: Number },
    posts    :      [ Post ]
});

mongoose.model( 'Grouptemp', Group );