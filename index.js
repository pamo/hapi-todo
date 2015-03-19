var Hapi = require('hapi');
var dbOpts = require('./config.js').mongo;
var server = new Hapi.Server();

server.register({
    register: require('hapi-mongodb'),
    options: dbOpts
}, function (err) {
    if (err) {
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

var save = function(request, reply){
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

var getAll = function(request, reply){
    var db = request.server.plugins['hapi-mongodb'].db;
    db.collection('todos').find().toArray(function(err, doc){
        return reply(doc);
    });
};

var getById = function(request, reply){
    var db = request.server.plugins['hapi-mongodb'].db;
    var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
    db.collection('todos')
    .findOne({"_id": new ObjectID(request.params.id)}, function(err, doc){
        return reply(doc);
    });
};

var deleteAll = function(request, reply) {
    var db = request.server.plugins['hapi-mongodb'].db;

    db.collection('todos').remove({}, function (err){
        if (err) return reply(Hapi.error.internal('Internal MongoDB error', err));
        reply("Deleted all todos");
    });
};

var deleteById = function(request, reply) {
    var db = request.server.plugins['hapi-mongodb'].db;
    var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;

    db.collection('todos').remove({"_id": new ObjectID(request.params.id)}, function (err){
        if (err) return reply(Hapi.error.internal('Internal MongoDB error', err));
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

