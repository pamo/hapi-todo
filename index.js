var Hapi = require('hapi');
var dbOpts = require('./config.js').mongo;
var server = new Hapi.Server();

server.register({
    register: require('hapi-mongodb'),
    options: dbOpts
}, function (err) {
    if (err) {
        console.error(err);
        throw err;
    }
});

server.connection({
    port: parseInt(process.env.PORT) || 3000,
    routes: {cors: true}
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});

var getAllTodos = function(request, reply){
    var db = request.server.plugins['hapi-mongodb'].db;
    db.collection('todos').find().toArray(function(err, doc){
        return reply(doc);
    });
};

var getTodoById = function(request, reply){
    var db = request.server.plugins['hapi-mongodb'].db;
    var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
    db.collection('todos')
    .findOne({"_id": new ObjectID(request.params.id)}, function(err, doc){
        console.log('\t\t\t\t' + doc);
        return reply(doc);
    });
};


var saveTodoToDb = function(request, reply){
    var todo = { 
            title: request.payload.title, 
            order: request.payload.order 
        };

    var db = request.server.plugins['hapi-mongodb'].db;

    db.collection('todos').insert(todo, {w:1}, function (err, doc){
        if (err){
            return reply(Hapi.error.internal('Internal MongoDB error', err));
        } else {
            reply(doc[0]);
        }
    });
};

server.route({
    method: 'GET',
    path: '/',
    handler: getAllTodos
});

server.route({
    method: 'POST',
    path: '/',
    handler: saveTodoToDb
});

server.route({
    method: 'GET',
    path: '/{id}',
    handler: getTodoById
});

