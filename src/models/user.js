
var mongoose 	= require( 'mongoose' ),
    Schema 		= mongoose.Schema,
    crypto 		= require( 'crypto' ),
    _ 			= require( 'underscore' ),
    settings    = require( '../settings/config' ).settings;

var User = new Schema({
    firstName   :	String,
    lastName    :	String,
    username    :	String,
    email       :	String,
    birthDay    :	String,
    passwordHash: 	String,
    salt        :	String,
    createdOn   :	Date
});

User.virtual( 'password' ).set(function( password ) {
    this._password 			= password;
    this.salt 				= this.makeSalt();
    this.passwordHash 		= this.encryptPassword( password );

}).get( function(){ return this.passwordHash; });

User.methods = {

    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */

    authenticate: function( plainText ) {
        return this.encryptPassword( plainText ) === this.passwordHash;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */

    makeSalt: function() {
        return Math.round( ( new Date().valueOf() * Math.random() ) ) + '';
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */

    encryptPassword: function( password ) {
        if ( !password )
            return '';

        return crypto.createHmac( 'sha1', this.salt ).update( password ).digest( 'hex' );
    }
}

mongoose.model( 'User', User );