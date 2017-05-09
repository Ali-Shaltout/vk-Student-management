var soapClientAuthService = require(__dirname + '/../auth/auth-client.service');
var constants = require(__dirname + '/../../app.constants');
var changePasswordValidator = require('./change-password.validator');

module.exports = function (app, sequelize, models) {
	app.put('/api/change-password', function(req, res) {
		var model = {};
		var errorDictionary = {};
		
		var soapClientCallback = function (param, user) {
			if (!user) {
				// TODO: 401 error
				return res.json(null);
			}
			
			var errorDictionary = changePasswordValidator(param);
			if (Object.keys(errorDictionary).length > 0) {
				model.errors = errorDictionary;
				res.status(400).json(model);
			}
			else {
				models.User
				.update({
					password: param.newPassword
				},
				{ where: { id: user.id, password: param.oldPassword } })
				.then(function(affectedUserRows) { // affectedUserRows for what this is even for?
					models.User
					.findOne({
						where: {
							id: user.id,
							password: param.newPassword
						}
					})
					.then(function (user) {
						if (!user) {
							// User become deleted or incorrect password
							errorDictionary["headerError"] = "Cannot change user password!";
							model.errors = errorDictionary;
							return res.status(400).json(model);
						}
						
						res.json(model);
					});
				});
			}
		}
		
		soapClientAuthService(req.body, model, models, soapClientCallback);
	});
};