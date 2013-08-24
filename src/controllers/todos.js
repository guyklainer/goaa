var mongoose    = require( 'mongoose' ),
    Utils       = require( '../utils/utils' ),
    sockets     = require( '../utils/sockets' ),
    _           = require( 'underscore'),
    Group       = mongoose.model( 'Group' ),
    Todo        = mongoose.model( 'Todo' ),
    GroupUser   = mongoose.model( 'GroupUser' );

module.exports.addTodo = function( req, res ) {
    var params  = req.body,
        todo    = new Todo( params );

    Group.update( { _id: params.groupID }, { $push: { "todos": todo } }, function( err, numAffected, rawResponse ){
        if ( err )
            res.json( Utils.createResult( false, err, "dbError" ) );

        else {
            sockets.getInstance().sockets.in( params.groupID ).emit( 'new-todo', todo );
            res.json( Utils.createResult( true, rawResponse, "todoAdded" ) );
        }
    });
};

module.exports.removeTodo = function( req, res ) {
    var params  = req.body;

    Group.update( { _id: params.groupID }, { $pull : { "todos" :  { _id : params.todoID } } }, function( err, numAffected, rawResponse ) {
        if ( err )
            res.json( Utils.createResult( false, err, "dbError" ) );

        else
            res.json( Utils.createResult( true, rawResponse, "todoRemoved" ) );
    });
};

module.exports.updateTodo = function( req, res ) {
    var params  = req.body;

    Group.update( { _id: params.groupID, "todos._id": params.data._id }, { $set : { "todos.$" : params.data } }, function( err, numAffected, rawResponse ) {
        if ( err )
            res.json( Utils.createResult( false, err, "dbError" ) );

        else
            res.json( Utils.createResult( true, rawResponse, "todoUpdated" ) );
    });
};
