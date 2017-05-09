var soapClientAuthService = require(__dirname + '/../auth/auth-client.service');
var constants = require(__dirname + '/../../app.constants');
var jwt = require('jsonwebtoken');
var createLessonValidator = require('./create-lesson.validator');

module.exports = function (app, sequelize, models) {
	app.get('/api/create-lesson', function(req, res) {
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
	
	app.post('/api/create-lesson', function(req, res) {
		var model = {};
		
		var soapClientCallback = function (param, user) {
			if (!user) {
				// TODO: 401 error
				return res.json(null);
			}
			
			var errorDictionary = createLessonValidator(param);
			if (Object.keys(errorDictionary).length > 0) {
				model.errors = errorDictionary;
				res.status(400).json(model);
			}
			else {
				if (user.roleId === constants.LECTURER) {
					models.Lesson
					.create({ userId: user.id, programmingLanguageId: param.programmingLanguageId, levelId: param.levelId, name: param.name, description: param.description })
					.then(function(lesson) {
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