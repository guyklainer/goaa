
var index           = require('../controllers/index'),
    utils           = require('../utils/utils'),
    uploader        = require('../utils/uploader'),
    users           = require( '../controllers/users' ),
    groups          = require( '../controllers/groups' ),
    groupsUsers     = require( '../controllers/groups-users' ),
    todos           = require( '../controllers/todos' ),
    meters          = require( '../controllers/meters' ),
    posts           = require( '../controllers/posts' );

module.exports = function( app, passport ) {

    //*****************************
    // Home
    //*****************************
    app.get('/',                        index.home );
    app.get('/partials/:name',          index.partials );


    //*****************************
    // Login & Signup
    //*****************************
    //app.get( '/login', users.login );
    app.post( '/logout',                users.logout );
    app.post( '/login',                 passport.authenticate( 'local' ), users.login );
    app.post( '/signup',                users.makeSignup );
    app.post( '/forgotpassword',        users.forgotPassword );
    app.post( '/resetpassword',         users.resetPassword );

    //*****************************
    // Users
    //*****************************
    app.post( '/searchusers',           utils.ensureAuthenticated, users.searchUser );

    //*****************************
    // Groups
    //*****************************
    app.post( '/creategroup',           utils.ensureAuthenticated, groups.makeGroup );
    app.post( '/editgroup',             utils.ensureAuthenticated, groups.editGroup );
    app.post( '/getgroups',             utils.ensureAuthenticated, groups.getGroupsByUser );
    app.post( '/getgroupbyname',        utils.ensureAuthenticated, groups.getGroupByName );
    app.post( '/getgrouppreview',       utils.ensureAuthenticated, groups.getGroupPreviewByName );
    app.post( '/searchgroups',          utils.ensureAuthenticated, groups.searchGroup );
    app.post( '/isgroupexist',          utils.ensureAuthenticated, groups.isGroupExist );


    //*****************************
    // Users Groups connections
    //*****************************
    app.post( '/joingroup',             utils.ensureAuthenticated, groupsUsers.joinGroup );
    app.post( '/isgroupadmin',          utils.ensureAuthenticated, groupsUsers.isGroupAdmin );
    app.post( '/isuseringroup',         utils.ensureAuthenticated, groupsUsers.isUserInGroup );
    app.post( '/approveuser',           utils.ensureAuthenticated, groupsUsers.approveUser );
    app.post( '/leavegroup',            utils.ensureAuthenticated, groupsUsers.removeUserFromGroup );
    app.post( '/addmember',             utils.ensureAuthenticated, groupsUsers.addUserByID );

    //*****************************
    // Posts
    //*****************************
    app.post( '/addpost',               utils.ensureAuthenticated, posts.addPost );
    app.post( '/removepost',            utils.ensureAuthenticated, posts.removePost );

    //*****************************
    // Todos
    //*****************************
    app.post( '/addtodo',               utils.ensureAuthenticated, todos.addTodo );
    app.post( '/removetodo',            utils.ensureAuthenticated, todos.removeTodo );
    app.post( '/updatetodo',            utils.ensureAuthenticated, todos.updateTodo );

    //*****************************
    // Meters
    //*****************************
    app.post( '/addmeter',              utils.ensureAuthenticated, meters.addMeter );
    app.post( '/checkmetername',        utils.ensureAuthenticated, meters.isMeterNameExist );
    app.post( '/removemeter',           utils.ensureAuthenticated, meters.removeMeter );

    //*****************************
    // API
    //*****************************
    app.post( '/api/validateUsername',  utils.ensureAuthenticated, users.userExist );
    app.post( '/api/upload',            utils.ensureAuthenticated, uploader.upload );

    //*****************************
    // Errors
    //*****************************
    app.get( '/401',                    index.e401 );
    app.get( '/404',                    index.e404 );
    app.get( '/403',                    index.e403 );
    app.get( '/500',                    index.e500 );

    //*****************************
    // Default route
    //*****************************
    app.get( '*',                       index.home );

}
