var soapClientAuthService = require(__dirname + '/../auth/auth-client.service');
var constants = require(__dirname + '/../../app.constants');
var jwt = require('jsonwebtoken');
var editSlideValidator = require('./edit-slide.validator');

module.exports = function (app, sequelize, models) {
	app.get('/api/edit-slide', function(req, res) {
		var model = {};
		
		var soapClientCallback = function (param, user) {
			if (!user) {
				// TODO: 401 error
				return res.json(null);
			}
			
			models.Slide
			.findOne({
				where: {
					id: param.id
				}
			})
			.then(function(slide) {
				if (!slide) {
					// Slide somehow don't exist.
					return res.json(model);
				}
				
				models.Topic
				.findOne({ where: { id: slide.topicId }, include: [ { model: models.Lesson, where: { userId: user.id }}] })
				.then(function(topic) {
					if (!topic) {
						// Impossible case but topic get deleted- but its probably huston trying to authorize not his own slide
						return res.json(model);
					}
					
					model.slide = {
						id: slide.id,
						topicId: slide.topicId,
						title: slide.title,
						description: slide.description,
						sequenceNumber: slide.sequenceNumber,
						answer: slide.answer
					};

					res.json(model);
				});
			});
		}
		
		soapClientAuthService(req.query, model, models, soapClientCallback);
	});
	
	app.put('/api/edit-slide', function(req, res) {
		var model = {};

		var soapClientCallback = function (param, user) {
			if (!user) {
				// TODO: 401 error
				return res.json(null);
			}
			
			var errorDictionary = editSlideValidator(param);
			if (Object.keys(errorDictionary).length > 0) {
				model.errors = errorDictionary;
				res.status(400).json(model);
			}
			else {
				models.Slide
				.findOne({
					where: {
						id: param.id
					}
				})
				.then(function(slide) {
					if (!slide) {
					// Slide somehow don't exist.
					return res.json(model);
					}
					
					models.Topic
					.findOne({ where: { id: slide.topicId }, include: [ { model: models.Lesson, where: { userId: user.id }}] })
					.then(function(topic) {
						if (!topic) {
							// Impossible case but topic get deleted- but its probably huston trying to authorize not his own slide
							return res.json(model);
						}
						
						models.Slide
						.update({
							title: param.title,
							description: param.description,
							name: param.name,
							sequenceNumber: param.sequenceNumber,
							answer: param.answer
						},
						{ where: { id: param.id } })
						.then(function(slide) {
							res.json(model);
						});
					});
					
				});
			}
		}
		
		soapClientAuthService(req.body, model, models, soapClientCallback);
	});
};