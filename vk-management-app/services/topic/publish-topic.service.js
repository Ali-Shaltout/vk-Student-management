var soapClientAuthService = require(__dirname + '/../auth/auth-client.service');
var constants = require(__dirname + '/../../app.constants');
var jwt = require('jsonwebtoken');

module.exports = function (app, sequelize, models) {
	app.put('/api/publish-topic', function(req, res) {
		var model = {};
		var errorDictionary = {};
		
		var soapClientCallback = function (param, user) {
			if (!user) {
				// TODO: 401 error
				return res.json(null);
			}
			
			models.Topic
			.findAll({
				where: {
					lessonId: param.lessonId
				},
				include: [
					{ model: models.Slide, where: { isPublished: true } },
					{ model: models.Lesson, where: { userId: user.id } }
				]
			})
			.then(function(topics) {
				if (!topics.find(o => o.id === param.topicId)) {
					errorDictionary["publishError"] = "Impossible to publish this topic because it has no published slides!";
					model.errors = errorDictionary;
					return res.status(400).json(model);
				}

				if (topics.filter(function(value){ return value.isPublished===true;}).length === 1 && !param.publishState) {
					errorDictionary["publishError"] = "Impossible to unpublish this topic because this is the last published topic with available published slides!";
					model.errors = errorDictionary;
					return res.status(400).json(model);
				}

				models.Topic
				.update({
					isPublished: param.publishState
				}, {
					where: {
						id: param.topicId
					}
				})
				.then(function(topic) {
					res.json(model);
				});
				
			});
		}
		
		soapClientAuthService(req.body, model, models, soapClientCallback);
	});
};