
var mongoose 	= require( 'mongoose' ),
    Schema 		= mongoose.Schema;

var Post = new Schema({
    _id         : Number,
    userID      : Number,
    data        : String,
    isDone      : boolean,
    createdOn   : Date
});

mongoose.model( 'Todo', Todo );