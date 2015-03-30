var Todo        = require('./todo.js').Todo;

var addUrl = function(server, todo){
   var baseUrl = 'http://' + server.host;
   todo.url = baseUrl + '/' + todo._id;
   return todo;
}

var save = function(request, reply){
   todo = new Todo();
   todo.title = request.payload.title;
   todo.order = request.payload.order;

   todo.save(function (err) {
    if (!err) {
      var response = addUrl(request.info, todo);
      reply(response);
    } else {
      reply(Hapi.error.internal('Internal MongoDB error', err));
    }
   });
};

var update = function(request, reply){
   Todo.findOneAndUpdate(request.params.id, request.payload, function (err, todo) {
    if (!err) {
      var response = addUrl(request.info, todo);
      reply(response);
    } else {
      reply(Hapi.error.internal('Internal MongoDB error', err));
    }
  });
};

var getAll = function(request, reply){
   var todosWithUrl = [];
  Todo.find({}, function (err, todos) {
      if (!err) {
	       for(i in todos){
	         todosWithUrl.push(addUrl(request.info, todos[i]));
	       }
         reply(todosWithUrl);
      } else {
        reply(err);
      }
   });
};

var getById = function(request, reply){
   Todo.findById(request.params.id, function(err, todo){
      if (err){
	       reply(err);
      }
      var response = addUrl(request.info, todo);
      reply(response);
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
    update: update,
    getAll: getAll,
    deleteAll: deleteAll,
    getById: getById,
    deleteById: deleteById,
}

module.exports = controller;