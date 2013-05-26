
var mongoose 	= require( 'mongoose' ),
    Schema 		= mongoose.Schema;

var Todo = new Schema({
    _id         : Number,
    userID      : Number,
    data        : String,
    isDone      : Boolean,
    createdOn   : Date
});

mongoose.model( 'Todo', Todo );