
var mongoose 	= require( 'mongoose' ),
    Schema 		= mongoose.Schema;

var Todo = new Schema({
    userID      : { type : Schema.ObjectId, ref : 'User' },
    username    : String,
    data        : String,
    isDone      : { type : Boolean, default : false },
    createdOn   : { type : Date,    default : Date.now }
});

var Post = new Schema({
    userID      : { type : Schema.ObjectId, ref : 'User' },
    username    : String,
    data        : String,
    image       : String,
    createdOn   : { type : Date, default : Date.now }
});

var Meter = new Schema({
    name        : { type : String, index : { unique: true, dropDups: true } },
    username    : String,
    password    : String,
    url         : String,
    type        : Number,
    createdOn   : { type : Date, default : Date.now }
});

var Group = new Schema({
    name     : 		String,
    createdOn: 		Date,
    image    :      String,
    address  : 		{ country: String, city: String, street: String, house: Number, apartment: Number },
    posts    :      [ Post ],
    todos    :      [ Todo ],
    meters   :      [ Meter ]
});

mongoose.model( 'Todo', Todo );
mongoose.model( 'Post', Post );
mongoose.model( 'Meter', Meter );
mongoose.model( 'Group', Group );