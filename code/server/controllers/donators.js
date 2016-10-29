var path = require('path'),
	Donators = require(path.join(__dirname, '..', 'models', 'donators')),
	api = require('express')(),
	parser = require('body-parser');

api.on('mount', function (parent) {
	this.io = parent.io;
});

api.use(parser.json());

api.get('/', function (req, res) {
	console.log(req.query[0]);
	var query = {}; 
	if (req.query[0] && req.query[1]) {
		var ne = JSON.parse(req.query[0]),
			sw = JSON.parse(req.query[1]);
		query = {
			'coordinates.lat': {
				$lte: ne.lat,
				$gte: sw.lat,
			},
			'coordinates.lng': {
				$lte: ne.lng,
				$gte: sw.lng,
			}
		};
	}
	console.log(query);
	Donators.find(query, {}, function (err, result) {
		res.send(result);
	});
});

api.post('/', function (req, res) {
	var donator = req.body;
	donator.ip = req.ip;
	Donators.create(donator, function (err, result) {
		res.send(result.ops[0]);
		if (err) return;
		req.app.io.emit('donatorCreated', result.ops[0]);
	});
});

api.param('donator', function (req, res, next, id) {
	Donators.findById(id, function (err, donator) {
		if (err) {
			res.status(500).send(err);
		} else if (!donator) {
			res.status(404).send({status: 404, error: 'Donator not found'});
		} else {
			req.donator = donator;
			next();
		}
	});
});

api.get('/:donator', function (req, res) {
	res.send(req.donator);
});

api.put('/:donator', function (req, res) {
	var donator = req.body;
	donator._id = req.donator._id;
	donator.ip = req.ip;
	Donators.update(donator, function (err, result) {
		res.send(result);
		if (err) return;
		req.app.io.emit('donatorChanged', result);
	});
});

api.delete('/:donator', function (req, res) {
	Donators.remove(req.donator, function (err) {
		res.send('removed');
		if (err) return;
		req.app.io.emit('donatorRemoved', req.donator._id);
	});
}); 

module.exports = api;

