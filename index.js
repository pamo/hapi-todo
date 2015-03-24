var Hapi        = require('hapi');
var dbOpts      = require('./config.js').mongo;
var Mongoose    = require('mongoose');
var Todo        = require('./todo.js').Todo;
var server      = new Hapi.Server();

Mongoose.connect(dbOpts.url);

server.connection({
    port: parseInt(process.env.PORT) || 3000,
    routes: {cors: true}
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});

var save = function(request, reply){
    todo = new Todo();
    todo.title = request.payload.title;
    todo.order = request.payload.order;
    todo.url = request.info.remoteAddress;

    todo.save(function (err) {
        if (!err) {
            reply(todo).created(todo._id);    // HTTP 201
        } else {
            reply(Hapi.error.internal('Internal MongoDB error', err));
        }
    });
};

var getAll = function(request, reply){
    Todo.find({}, function (err, todos) {
        if (!err) {
            reply(todos);
        } else {
            reply(err);
        }
    });
};

var getById = function(request, reply){
    Todo.findById(request.params.id, function(err, todo){
        if (err){
            reply(404);
        }
        reply(todo);
    });
};

var deleteAll = function(request, reply) {
   Todo.remove({}, function (err, todos) {
       if (err) return reply(Hapi.error.internal('Internal MongoDB error', err));
       return reply("Deleted all todos");
    });
};

var deleteById = function(request, reply) {
    Todo.findById(request.params.id, function (err, todo){
        if (err) return reply(Hapi.error.internal('Internal MongoDB error', err));
        todo.remove();
        reply("Record Deleted");
    });
};

server.route({
    method: 'GET',
    path: '/',
    handler: getAll
});

server.route({
    method: 'POST',
    path: '/',
    handler: save
});

server.route({
    method: 'DELETE',
    path: '/',
    handler: deleteAll
})

server.route({
    method: 'GET',
    path: '/{id}',
    handler: getById
});

server.route({
    method: 'DELETE',
    path: '/{id}',
    handler: deleteById
})

