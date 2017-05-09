var soapClientAuthService = require(__dirname + '/../auth/auth-client.service');
var constants = require(__dirname + '/../../app.constants');
var jwt = require('jsonwebtoken');

module.exports = function (app, sequelize, models) {
	app.get('/api/start-topic', function(req, res) {
		var model = {};
		var errorDictionary = {};
		
		var soapClientCallback = function (param, user) {
			if (!user) {
				// TODO: 401 error
				return res.json(null);
			}
			
			models.Topic
			.findOne({
				where: {
					id: param.topicId,
					isPublished: true
				},
				include: [
					{ model: models.Slide, where: { isPublished: true } },
					{ model: models.UserLessonHistory, where: { userId: user.id } },
					{ model: models.Lesson, where: { isPublished: true }, include: [ models.Level, models.User ] }
				],
				order: [
					[ models.Slide, 'sequenceNumber', 'ASC' ]
				]
			})
			.then(function(topic) {
				if (!topic) {
					var errorDictionary = {};
					errorDictionary["errorHeader"] = "Impossible to start not existing topic.";
					model.errors = errorDictionary;
					return res.status(400).json(model);
				}
				
				var currentActiveSlideId = 0;
				var isCurrentActiveTopicFinished = false;
				var callbackIterator = 0;
				models.Topic
				.findAll({ where: { lessonId: topic.lessonId, isPublished: true }, include: [ { model: models.UserLessonHistory, where: { userId: user.id } } ] })
				.then(function(topics) {
					currentActiveSlideId = topics.find(o => o.id == param.topicId).UserLessonHistories[0].slideId;
					if (!topic.Slides.find(o => o.id == currentActiveSlideId)) {
						// Because Lecturer deleted or unpublished user current slide in which he stopt last time and since we have no history about further possible lecturer modifications then currentActiveSlide is set to default.
						models.UserLessonHistory
							.update({
								slideId: topic.Slides[0].id
							}, {
								where: {
									slideId: currentActiveSlideId
								}
							});
							currentActiveSlideId = topic.Slides[0].id;
					}
					isCurrentActiveTopicFinished = topics.find(o => o.id == param.topicId).UserLessonHistories[0].isTopicFinished;
					
					if (topics.length > 1) {
						for (callbackIterator; callbackIterator < topics.length; callbackIterator++) {
							var isTopicFinished = topics[callbackIterator].UserLessonHistories.find(o => o.topicId === topics[callbackIterator].id).isTopicFinished;
							if (topics[callbackIterator].sequenceNumber < topic.sequenceNumber && !isTopicFinished) { // was if (topics[callbackIterator].sequenceNumber < topic.sequenceNumber && !isTopicFinished)
								var errorDictionary = {};
								errorDictionary["errorHeader"] = "Impossible to start topic before not finishing already on-learning topic.";
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
					model.topic = {
						id: topic.id,
						lessonId: topic.lessonId,
						name: topic.name,
						level: topic.Lesson.Level.name,
						teacher: topic.Lesson.User.firstname + " " + topic.Lesson.User.lastname,
						slidesLength: topic.Slides.length,
						activeSlideId: currentActiveSlideId,
						isTopicFinished: isCurrentActiveTopicFinished,
						slides: []
					};
					
					var stillSetAnswer = true;
					for (var i = 0; i < topic.Slides.length; i++) {
						if (currentActiveSlideId === topic.Slides[i].id) {
							stillSetAnswer = false;
						}
						
						var slideDto = {};
						slideDto.id = topic.Slides[i].id;
						slideDto.topicId = topic.Slides[i].topicId;
						slideDto.title = topic.Slides[i].title;
						slideDto.description = topic.Slides[i].description;
						if (stillSetAnswer || isCurrentActiveTopicFinished) {
							slideDto.answer = topic.Slides[i].answer;
						}
						else {
							slideDto.answer = null;
						}
						slideDto.isAnswerable = topic.Slides[i].answer ? true : false;
						slideDto.sequenceNumber = topic.Slides[i].sequenceNumber;
						model.topic.slides.push(slideDto);
					}
					
					
					res.json(model);
				}
			});
		}
		
		soapClientAuthService(req.query, model, models, soapClientCallback);
	});
};