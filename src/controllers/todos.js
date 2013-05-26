var mongoose    = require( 'mongoose' ),
    Crypto      = require( 'crypto' ),
    Todo        = mongoose.model( 'Todo' ),
    Group       = mongoose.model( 'Group' ),
    GroupUser   = mongoose.model( 'GroupUser' ),
    Utils       = require( '../utils/utils' ),
    _           = require( 'underscore' );

module.exports.addTodo = function( req, res ) {
    var params  = req.body;

    Group.findOne( { _id: params.groupID }, function( err, group ){

        if ( err ) {
            res.json( Utils.createResult( false, err, "dbError" ) );
        }

        if( !group ){
            res.json( Utils.createResult( false, null, "noGroupFound" ) );
        } else {

            var timestamp = new Date().getTime(),
                todo = {
                    _id         : Crypto.randomBytes( 48 ).toString('hex') + timestamp,
                    userID      : params.userID,
                    data        : params.data,
                    isDone      : false,
                    createdOn   : new Date()
                };

            group.todos.push( todo );
            group.save( function( err ){

                if( err ){
                    res.json( Utils.createResult( false, err, "dbError" ) );

                } else {
                    res.json( Utils.createResult( true, null, "todoAdded" ) );
                }
            });
        }
    });
}

module.exports.removeTodo = function( req, res ) {
    var params  = req.body;

    Group.findOne( { _id: params.groupID }, function( err, group ){

        if ( err ) {
            res.json(Utils.createResult( false, err, "dbError" ));
        }

        if( !group ){
            res.json(Utils.createResult( false, null, "noGroupFound" ));

        } else {
            var todos = group.todos;

            for( var i = 0; i < todos.length; i++ ){

                if ( todos[i]._id == params.todoID ){
                    todos.splice( i, 1 );
                    updateTodos( group._id, todos, res );
                    break;
                }
            }
        }
    });
}

module.exports.toggleTodo = function( req, res ) {
    var params  = req.body;

    Group.findOne( { _id: params.groupID }, function( err, group ){

        if ( err ) {
            res.json(Utils.createResult( false, err, "dbError" ));
        }

        if( !group ){
            res.json(Utils.createResult( false, null, "noGroupFound" ));

        } else {
            var todos = group.todos;

            for( var i = 0; i < todos.length; i++ ){

                if ( todos[i]._id == params.todoID ){
                    if ( todos[i].isDone ){
                        todos[i].isDone = false;
                    } else {
                        todos[i].isDone = true;
                    }

                    updateTodos( group._id, todos, res );
                    break;
                }
            }
        }
    });
}

function updateTodos( groupID, todos, res ) {
    Group.update( { _id: groupID }, { $set: { todos: todos } }, function( err ){
        if( err ){
            res.json( Utils.createResult( false, err, "dbError" ) );
        } else {
            res.json( Utils.createResult( true, null, "todoRemoved" ) );
        }
    });
}