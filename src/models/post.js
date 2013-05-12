
var mongoose 	= require( 'mongoose' ),
    Schema 		= mongoose.Schema;

var Post = new Schema({
    _id         : Number,
    userID      : Number,
    data        : String,
    createdOn   : Date
});

mongoose.model( 'Post', Post );