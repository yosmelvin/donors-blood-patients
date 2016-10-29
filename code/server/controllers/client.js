var express = require('express'),
	path = require('path');

var client = express();

client.use('/vendor', express.static(path.join(__dirname, '..', '..', '..', 'node_modules')));
client.use(express.static(path.join(__dirname, '..', '..', 'client')));
client.use(function (req, res) {
	res.sendFile(path.join(__dirname, '..', '..', 'client', 'index.html'));
});


module.exports = client;