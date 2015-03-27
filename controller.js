var Todo        = require('./todo.js').Todo;

var addUrl = function(server, todo){
   var baseUrl = server.protocol + '://' + server.address + ':' + server.port;
   todo.url = baseUrl + '/' + todo._id;
   return todo;
}

var save = function(request, reply){
    todo = new Todo();
    todo.title = request.payload.title;
    todo.order = request.payload.order;
    todo.url = request.info.remoteAddress;

    todo.save(function (err) {
        if (!err) {
            var serverInfo = request.server.info;
            reply(addUrl(serverInfo, todo)).created(todo._id);    // HTTP 201
        } else {
            reply(Hapi.error.internal('Internal MongoDB error', err));
        }
    });
};

var getAll = function(request, reply){
   var todosWithUrl = [];
   var serverInfo = request.server.info;
    Todo.find({}, function (err, todos) {
        if (!err) {
           for(i in todos){
              todosWithUrl.push(addUrl(serverInfo, todos[i]));
           }
           reply(todosWithUrl);
        } else {
            reply(err);
        }
    });
};

var getById = function(request, reply){
    var serverInfo = request.server;
    Todo.findById(request.params.id, function(err, todo){
        if (err){
            reply(404);
        }
        reply(addUrl(serverInfo, todo));
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

var controller = {
    save: save,
    getAll: getAll,
    deleteAll: deleteAll,
    getById: getById,
    deleteById: deleteById,
}

module.exports = controller;
