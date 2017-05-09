var soapClientAuthService = require(__dirname + '/../auth/auth-client.service');
var constants = require(__dirname + '/../../app.constants');

module.exports = function (app, sequelize, models) {
	app.put('/api/publish-lesson', function(req, res) {
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
					lessonId: param.id,
					isPublished: true
				},
				include: [
					{ model: models.Slide, where: { isPublished: true } }
				]
			})
			.then(function(topics) {
				if (topics.length <= 0) {
					errorDictionary["publishError"] = "Impossible to publish this lesson because it has no published topics/lessons!";
					model.errors = errorDictionary;
					return res.status(400).json(model);
				}

				models.Lesson
				.update({
					isPublished: param.publishState
				}, {
					where: {
						id: param.id,
						userId: user.id
					}
				})
				.then(function(lesson) {
					res.json(model);
				});
				
			});
		}
		
		soapClientAuthService(req.body, model, models, soapClientCallback);
	});
};