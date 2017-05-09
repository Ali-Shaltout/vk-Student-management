var soapClientAuthService = require(__dirname + '/../auth/auth-client.service');
var constants = require(__dirname + '/../../app.constants');
var loginValidator = require('./login.validator');
var jwt = require('jsonwebtoken');

module.exports = function (app, sequelize, models) {
	app.post('/api/login', function(req, res) {
		var errorDictionary = loginValidator(req.body);
		if (Object.keys(errorDictionary).length > 0) {
			res.status(400).json(errorDictionary);
		}
		else {
			var model = {};
			
			var soapClientCallback = function (param, user) {
				if (user){
					res.json(model);
				}
				else {
					errorDictionary["errorHeader"] = "Incorrect user data.";
					res.status(400).json(errorDictionary);
				}
			}
			
			soapClientAuthService(req.body, model, models, soapClientCallback);
		}
	});
};