var soapClientAuthService = require(__dirname + '/../auth/auth-client.service');
var constants = require(__dirname + '/../../app.constants');
var jwt = require('jsonwebtoken');
var createSlideValidator = require('./create-slide.validator');

module.exports = function (app, sequelize, models) {
	app.get('/api/create-slide', function(req, res) {
		var model = {};
		
		var soapClientCallback = function (param, user) {
			if (!user) {
				// TODO: 401 error
				return res.json(null);
			}
			
			res.json(model);
		}
		
		soapClientAuthService(req.query, model, models, soapClientCallback);
	});
	
	app.post('/api/create-slide', function(req, res) {
		var model = {};
		
		var soapClientCallback = function (param, user) {
			if (!user) {
				// TODO: 401 error
				return res.json(null);
			}
			
			var errorDictionary = createSlideValidator(param);
			if (Object.keys(errorDictionary).length > 0) {
				model.errors = errorDictionary;
				res.status(400).json(model);
			}
			else {
				if (user.roleId === constants.LECTURER) {
					models.Slide
					.create({ topicId: param.topicId, title: param.title, description: param.description, answer: param.answer, sequenceNumber: param.sequenceNumber })
					.then(function(slide) {
						res.json(model);
					});
				}
				else {
					// TODO: You are not lecturer
					res.json(model);
				}
			}
		}
		
		soapClientAuthService(req.body, model, models, soapClientCallback);
	});
};