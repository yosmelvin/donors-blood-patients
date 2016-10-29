var mongo = require('mongodb'),
	client = mongo.MongoClient;

exports.connect = function (callback) {
	if (mongo.DB) {
		return mongo.DB;
	} else {
		const url = process.env.MONGOLAB_URI || process.env.DB || process.env.npm_package_config_db || "mongodb://localhost:27017/blooddonator";
		
		if (!url)  {
			console.error('No database url specified. Use env DB, or package.json.');
			process.exit(1);
		}
		
		client.connect(url, function (err, db) {
			if (err) {
				console.error('Problem with MongoDB');
				console.error(err);
				process.exit(1);
			} else {
				mongo.DB = db;
				if (callback) {
					callback(db);
				}
			}
		});
	}
};