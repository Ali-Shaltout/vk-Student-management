var soapClientAuthService = require(__dirname + '/../auth/auth-client.service');
var constants = require(__dirname + '/../../app.constants');
var changePersonalInfoValidator = require('./change-personal-info.validator');

module.exports = function (app, sequelize, models) {
	app.put('/api/change-personal-info', function(req, res) {
		var model = {};
		var errorDictionary = {};
		
		var soapClientCallback = function (param, user) {
			if (!user) {
				// TODO: 401 error
				return res.json(null);
			}
			
			var errorDictionary = changePersonalInfoValidator(param);
			if (Object.keys(errorDictionary).length > 0) {
				model.errors = errorDictionary;
				res.status(400).json(model);
			}
			else {
				models.User
				.update({
					firstname: param.firstname,
					lastname: param.lastname,
					email: param.email
				},
				{ where: { id: user.id } })
				.then(function(affectedUserRows) { // affectedUserRows for what this is even for?
					res.json(model);
				});
			}
		}
		
		soapClientAuthService(req.body, model, models, soapClientCallback);
	});
};