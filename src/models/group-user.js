
var mongoose 	= require( 'mongoose' ),
    Schema 		= mongoose.Schema;

var GroupUser = new Schema({
    group       : Schema.ObjectId,
    user        : Schema.ObjectId,
    isAdmin     : Boolean,
    approved    : Boolean,
    createdOn   : Date
});

mongoose.model( 'GroupUser', GroupUser );