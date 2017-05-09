var soapClientAuthService = require(__dirname + '/../auth/auth-client.service');
var constants = require(__dirname + '/../../app.constants');
var jwt = require('jsonwebtoken');
var createTopicValidator = require('./create-topic.validator');

module.exports = function (app, sequelize, models) {
	app.get('/api/create-topic', function(req, res) {
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
	
	app.post('/api/create-topic', function(req, res) {
		var model = {};
		
		var soapClientCallback = function (param, user) {
			if (!user) {
				// TODO: 401 error
				return res.json(null);
			}
			
			var errorDictionary = createTopicValidator(param);
			if (Object.keys(errorDictionary).length > 0) {
				model.errors = errorDictionary;
				res.status(400).json(model);
			}
			else {
				if (user.roleId === constants.LECTURER) {
					models.Topic
					.create({ lessonId: param.lessonId, name: param.name, sequenceNumber: param.sequenceNumber })
					.then(function(topic) {
						// Form new sequence before deleting entry
						models.Topic
						.findAll({ where: { lessonId: param.lessonId } })
						.then(function(topics) {
							var filteredTopics = topics.filter(function(el) {
								return el.id !== param.topicId;
							});
							
							for (var i = 0; i < filteredTopics.length; i++) {
								models.Topic
								.update({
									sequenceNumber: i + 1
								}, {
									where: {
										id: filteredTopics[i].id,
										lessonId: param.lessonId
									}
								});
							}
							
							res.json(model);
						});
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