
var mongoose    = require( 'mongoose' ),
    Group        = mongoose.model( 'Group' ),
    utils       = require( '../utils/utils' );

//module.exports.login = function( req, res ) {
//    if( req.isAuthenticated() )
//        res.redirect( '/profile' );
//    else
//        res.render( 'login', {
//            title: "Goaa - Login"
//        });
//}

module.exports.makeGroup = function( req, res ) {
    var result = {
        result: true,
        isGroupNameValid: true
    };
    var params = req.body;

    params.createdOn = new Date();
    var group = new Group( params );

    //result = validateSignupRequest( params );
    if( result.result ){
        group.save( function( err, group, count ){
            if( err ){
                result.result = false;
            }
        });
    }

    res.json( result );
}

function isGroupExist( name, callback ) {
    Group.findOne({ groupName: name }, function( err, group ){
        callback( group != null );
    });
}