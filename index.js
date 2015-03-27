var Hapi        = require('hapi');
var dbOpts      = require('./config.js').mongo;
var Mongoose    = require('mongoose');
var server      = new Hapi.Server();

Mongoose.connect(dbOpts.url);

server.connection({
    port: parseInt(process.env.PORT) || 3000,
    routes: {cors: true}
});

var plugins = [ { register: require('./routes.js') }];

server.register(plugins, function (err) {
    if (err) { throw err; }
    server.start(function () {
       console.log('Server running at:', server.info.uri);
    });
});
