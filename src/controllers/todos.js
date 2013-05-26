var mongoose    = require( 'mongoose' ),
    Crypto      = require( 'crypto' ),
    Post        = mongoose.model( 'Post' ),
    Group       = mongoose.model( 'Group'),
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
            var todos = group.todos,
                isChanged = false;

            _.each( todos, function ( todo ){
                if ( todo._id == params.todoID ){
                    delete todo;
                    isChanged = true;
                    return false;
                }
            } );

            if ( isChanged ){
                Group.update( { _id: group._id }, { $set: { todos: todos } }, function( err ){
                    if( err ){
                        res.json( Utils.createResult( false, err, "dbError" ) );
                    } else {
                        res.json( Utils.createResult( true, null, "todoRemoved" ) );
                    }
                });
            } else {
                res.json( Utils.createResult( false, null, "todoWasn'tFound" ) );
            }
        }
    });
}


module.exports.toggleTodo = function( req, res ) {
    var params = req.body;

    Group.findOne( { _id: params.groupID }, function( err, group ){

        if ( err ) {
            res.json(Utils.createResult( false, err, "dbError" ));
        }

        if( !group ){
            res.json(Utils.createResult( false, null, "noGroupFound" ));

        } else {
            var todos = group.todos,
                isChanged = false;

            _.each( todos, function ( todo ){
                if ( todo._id == params.todoID ){
                    if ( todo.isDone ){
                        todo.isDone = false;
                    } else {
                        todo.isDone = true;
                    }
                    isChanged = true;
                    return false;
                }
            } );

            if ( isChanged ){
                Group.update( { _id: group._id }, { $set: { todos: todos } }, function( err ){
                    if( err ){
                        res.json( Utils.createResult( false, err, "dbError" ) );
                    } else {
                        res.json( Utils.createResult( true, null, "todoChecked" ) );
                    }
                });
            } else {
                res.json( Utils.createResult( false, null, "todoWasn'tFound" ) );
            }
        }
    });
}