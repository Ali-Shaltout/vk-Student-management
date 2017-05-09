var soapClientAuthService = require(__dirname + '/../auth/auth-client.service');
var constants = require(__dirname + '/../../app.constants');
var jwt = require('jsonwebtoken');
var editTopicValidator = require('./edit-topic.validator');

module.exports = function (app, sequelize, models) {
	app.get('/api/edit-topic', function(req, res) {
		var model = {};
		
		var soapClientCallback = function (param, user) {
			if (!user) {
				// TODO: 401 error
				return res.json(null);
			}
			
			models.Topic
			.findOne({
				where: {
					id: param.id
				},
				include: [
					{ model: models.Lesson, where: { userId: user.id } },
					{ model: models.Slide }
				],
				order: [
					[ models.Slide, 'sequenceNumber', 'ASC' ]
				]
			})
			.then(function(topic) {
				if (!topic) {
					return res.json(model);
				}
				
				model.topic = {
					id: topic.id,
					lessonId: topic.lessonId,
					name: topic.name,
					sequenceNumber: topic.sequenceNumber,
					slides: topic.Slides
				};

				res.json(model);
			});
		}
		
		soapClientAuthService(req.query, model, models, soapClientCallback);
	});
	
	app.put('/api/edit-topic', function(req, res) {
		var model = {};

		var soapClientCallback = function (param, user) {
			if (!user) {
				// TODO: 401 error
				return res.json(null);
			}
			
			var errorDictionary = editTopicValidator(param);
			if (Object.keys(errorDictionary).length > 0) {
				model.errors = errorDictionary;
				res.status(400).json(model);
			}
			else {
				models.Topic
				.findOne({
					where: {
						id: param.id
					},
					include: [
						{ model: models.Lesson, where: { userId: user.id } }
					]
				})
				.then(function(topic) {
					if (!topic) {
						// TODO: No rights to edit this topic
						return res.json(model);
					}
					
					models.Topic
					.update({
						name: param.name,
						sequenceNumber: param.sequenceNumber
					},
					{ where: { id: param.id } })
					.then(function(topic) {
						res.json(model);
					});
				});
			}
		}
		
		soapClientAuthService(req.body, model, models, soapClientCallback);
	});
};