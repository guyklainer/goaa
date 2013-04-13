var mongoose 	= require( 'mongoose' ),
	Schema 		= mongoose.Schema,
	conf        = require('./config'),
    settings    = conf.settings;

var User = new Schema({
	id: 			String,
	firstName: 		String,
	lastName: 		String,
	username: 		String,
	email: 			String,
	birthDay: 		String,
	passwordHash: 	String,
	createdOn: 		Date
});

mongoose.model( 'User', User );
mongoose.connect( settings.db );