
var mongoose 	= require( 'mongoose' ),
    Schema 		= mongoose.Schema;

var GroupUser = new Schema({
    group   : Schema.types.ObjectId,
    user    : Schema.types.ObjectId,
    isAdmin : Boolean,
    createdOn: Date
});

mongoose.model( 'GroupUser', GroupUser );