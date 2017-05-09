var soapClientAuthService = require(__dirname + '/../auth/auth-client.service');
var constants = require(__dirname + '/../../app.constants');
var jwt = require('jsonwebtoken');

module.exports = function (app, sequelize, models) {
	app.post('/api/delete-topic', function(req, res) {
		var model = {};
		var errorDictionary = {};
		
		var soapClientCallback = function (param, user) {
			if (!user) {
				// TODO: 401 error
				return res.json(null);
			}
			
			models.Lesson
			.findOne({
				where: {
					id: param.lessonId,
					userId: user.id // make sure user deleting his own topic
				},
				include: [
					{ model: models.Topic }
				]
			})
			.then(function(lesson) {
				if (!lesson) {
					errorDictionary["deleteError"] = "Impossible to delete this topic because you are not the topic owner or topic is already deleted!";
					model.errors = errorDictionary;
					return res.status(400).json(model);
				}
				
				if (lesson.isPublished // Do not let to delete if lesson is published
				&& lesson.Topics.find(o => o.id === param.topicId).isPublished // and Do not let to delete if topic itself is published
				&& lesson.Topics.filter(function(value){ return value.isPublished===true;}).length === 1) { // and Do not let to delete if only one topic is published all in all
					errorDictionary["deleteError"] = "Impossible to delete this topic because its lesson is published and this is the last topic for this lesson! Unpublish your lesson in order to delete this topic!";
					model.errors = errorDictionary;
					return res.status(400).json(model);
				}
				
				// Form new sequence before deleting entry
				var topics = lesson.Topics.filter(function(el) {
					return el.id !== param.topicId;
				});
				
				for (var i = 0; i < topics.length; i++) {
					models.Topic
					.update({
						sequenceNumber: i + 1
					}, {
						where: {
							id: topics[i].id,
							lessonId: param.lessonId
						}
					});
				}
				
				models.Topic
				.destroy({
					where: {
						id: param.topicId
					}
				})
				.then(function(isDeleted) {
					model.isDeleted = isDeleted;
					res.json(model);
				});
			});
		}
		
		soapClientAuthService(req.body, model, models, soapClientCallback);
	});
};