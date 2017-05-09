var soapClientAuthService = require(__dirname + '/../auth/auth-client.service');
var constants = require(__dirname + '/../../app.constants');
var jwt = require('jsonwebtoken');

module.exports = function (app, sequelize, models) {
	app.put('/api/next-slide', function(req, res) {
		var model = {};
		var errorDictionary = {};
		
		var soapClientCallback = function (param, user) {
			if (!user) {
				// TODO: 401 error
				return res.json(null);
			}
			
			models.UserLessonHistory
			.findOne({ 
				where: {
					topicId: param.topicId,
					userId: user.id
				},
				include: [
					{ model: models.Topic, where: { isPublished: true }, required: false, include: [ { model: models.Slide, where: { isPublished: true }, required: false } ] }
				],
				order: [
					[ models.Topic, 'sequenceNumber', 'ASC' ],
					[ models.Topic, models.Slide, 'sequenceNumber', 'ASC' ]
				]
			})
			.then(function(userLessonHistory) {
				if (!userLessonHistory) {
					errorDictionary["nextError"] = "Invalid userId or invalid topicId";
					model.errors = errorDictionary;
					return res.status(400).json(model);
				}

				var callbackIterator = 0;
				models.Topic
				.findAll({ where: { isPublished: true, lessonId: userLessonHistory.Topic.lessonId }, include: [ { model: models.UserLessonHistory, where: { userId: user.id } } ] })
				.then(function(topics) {
					if (topics.length > 1) {
						console.log("sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss" + JSON.stringify(topics));
						for (callbackIterator; callbackIterator < topics.length; callbackIterator++) {
							var isTopicFinished = topics[callbackIterator].UserLessonHistories.find(o => o.topicId === topics[callbackIterator].id).isTopicFinished;
							if (topics[callbackIterator].sequenceNumber < userLessonHistory.Topic.sequenceNumber && !isTopicFinished) {
								var errorDictionary = {};
								errorDictionary["nextHeader"] = "Impossible to start topic before not finishing already on-learning topic.";
								model.errors = errorDictionary;
								res.status(400).json(model);
								break;
							}
						}
					}
					else {
						callbackIterator = 1;
					}
					
					if (callbackIterator === topics.length) {
						successValidationCallback();
					}
				});
				
				function successValidationCallback() {
					var currentSlide = userLessonHistory.Topic.Slides.find(o => o.id === userLessonHistory.slideId)
					var nextSlideIndex = userLessonHistory.Topic.Slides.indexOf(currentSlide);
					
					if (currentSlide.answer !== param.answer) {
						errorDictionary["nextError"] = "Incorrect answer. You can not go to next slide before answering.";
						model.errors = errorDictionary;
						return res.status(400).json(model);
					}

					if (nextSlideIndex !== -1) {
						var nextSlide = userLessonHistory.Topic.Slides[++nextSlideIndex];
						if (nextSlide) {
							models.UserLessonHistory
							.update({
								slideId: nextSlide.id
							}, {
								where: {
									topicId: param.topicId
								}
							})
							.then(function(slide) {
								res.json(model);
							});
						}
						else {
							// This is the last slide
							models.UserLessonHistory
							.update({
								isTopicFinished: true
							}, {
								where: {
									topicId: param.topicId
								}
							})
							.then(function(slide) {
								res.json(model);
							});
						}
					}
					else {
						// Quite impossible scenario
						res.json(model);
					}
				}
			});
		}
		
		soapClientAuthService(req.body, model, models, soapClientCallback);
	});
};