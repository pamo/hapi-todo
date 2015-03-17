
var Hapi = require('hapi');

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
        return reply('success');
    }
});
