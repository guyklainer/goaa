
var mongoose 	= require( 'mongoose' ),
    Schema 		= mongoose.Schema;

var GroupUser = new Schema({
    group       : { type : Schema.ObjectId, ref : 'Group' },
    user        : { type : Schema.ObjectId, ref : 'User' },
    isAdmin     : { type : Boolean  , default : false },
    approved    : { type : Boolean  , default : false },
    createdOn   : { type : Date     , default : Date.now }
});

mongoose.model( 'GroupUser', GroupUser );