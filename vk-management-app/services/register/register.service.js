var registerValidator = require('./register.validator');

module.exports = function (app, sequelize, models) {
	app.post('/api/register', function(req, res) {
		var errorDictionary = registerValidator(req.body);
		if (Object.keys(errorDictionary).length > 0) {
			res.status(400).json(errorDictionary);
		}
		else {
			models.User
			.findOrCreate({where: {email: req.body.email}, defaults: req.body})
			.spread(function(user, created) {
				if (created) {
					res.json("gzgz");
				}
				else {
					errorDictionary["errorHeader"] = "User with such email already exists.";
					res.status(400).json(errorDictionary);
				}
			});	
		}
	});
};