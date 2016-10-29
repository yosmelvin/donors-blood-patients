var path = require('path'),
	db = require(path.join(__dirname, 'server', 'services', 'db')),
	api = require(path.join(__dirname, 'server', 'controllers', 'donators')), 
	client = require(path.join(__dirname, 'server', 'controllers', 'client')),
	app = require('express')(),
	server = require('http').Server(app);
	
app.io = require('socket.io')(server);
app.use('/api/donators', api);
app.use(client);

server.listen(process.env.PORT || (process.argv[2] || process.env.npm_package_config_port || 80), function () {
	db.connect();
	console.log(server.address());
});

