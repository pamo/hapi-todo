var Hapi = require('hapi');

var todos = [{ 
    title: 'a todo',
    order: 1 
}];

var server = new Hapi.Server();
server.connection({
    port: parseInt(process.env.PORT) || 3000,
    routes: {cors: true}
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        return reply(todos);
    }
});

server.route({
    method: 'POST',
    path: '/',
    handler: function(request, reply){
        var todo = { 
            title: request.payload.title, 
            order: request.payload.order 
        };
        todos.push(todo);
        return reply(todo);
    }
});
