var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
	
module.exports = function (express, app) {
	app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
	app.use(bodyParser.json());                                     // parse application/json
	app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
	app.use(methodOverride());

	app.use(express.static('www'))

	app.get('/*', function(req, res, next) {
		if(req.url.indexOf("api") > -1) { // noob medal please
			return next();
		}
		
		res.sendFile('www/index.html', { root: __dirname });
	});

	app.listen(4040, function () {
		console.log('Example app listening on port 3000!')
	});
};