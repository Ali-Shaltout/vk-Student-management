var soapClientAuthService = require(__dirname + '/../auth/auth-client.service');
var constants = require(__dirname + '/../../app.constants');
var jwt = require('jsonwebtoken');

module.exports = function (app, sequelize, models) {
	app.get('/api/start-lesson', function(req, res) {
		var model = {};
		
		var soapClientCallback = function (param, user) {
			if (!user) {
				// TODO: 401 error
				return res.json(null);
			}
			
			models.Lesson
			.findOne({
				where: {
					id: param.lessonId,
					isPublished: true
				},
				include: [
					{ model: models.Level },
					{ model: models.ProgrammingLanguage },
					{ model: models.User },
					{ model: models.Topic, where: { isPublished: true }, include: [ { model: models.Slide, where: { isPublished: true } }, { model: models.UserLessonHistory, where: { userId: user.id }, required: false } ] }
				],
				order: [
					[ models.Topic, 'sequenceNumber', 'ASC' ],
					[ models.Topic, models.Slide, 'sequenceNumber', 'ASC' ]
				]
			})
			.then(function(lesson) {
				if (!lesson) {
					return res.json(model); // unexpected param returns null
				}
				
				var topicListDto = [];
				for (var topicIndex = 0; topicIndex < lesson.Topics.length; topicIndex++) {
					var topic = lesson.Topics[topicIndex];
					var topicDto = {};
					topicDto.id = topic.id;
					topicDto.lessonId = topic.lessonId;
					topicDto.name = topic.name;
					topicDto.sequenceNumber = topic.sequenceNumber;
					topicDto.isEnabled = false;
					topicDto.userSlidesLength = 0;
					topicDto.slidesLength = topic.Slides.length;
					topicListDto.push(topicDto);
				}
				
				if (lesson.Topics) {

					for (var topicIndex = 0; topicIndex < lesson.Topics.length; topicIndex++) {
						var topic = lesson.Topics[topicIndex];
						var topicDto = topicListDto.find(o => o.id === topic.id);
						if (topicIndex === 0) { // First topic always enabled
							topicDto.userSlidesLength = 1;
							topicDto.isEnabled = true;

						}

						var userLessonHistories = topic.UserLessonHistories;
						if (userLessonHistories) {
							for (var userLessonHistoryIndex = 0; userLessonHistoryIndex < userLessonHistories.length; userLessonHistoryIndex++) {
								var userLessonHistory = topic.UserLessonHistories[userLessonHistoryIndex];
								if (userLessonHistory) {
									if (userLessonHistory.isTopicFinished) {
										var nextTopixIndex = topicIndex;
										var nextTopic = topicListDto[++nextTopixIndex];
										if (nextTopic) {
											nextTopic.userSlidesLength = 1;
											nextTopic.isEnabled = true;
										}
									}
									
									if (topic.Slides.find(o => o.id === userLessonHistory.slideId)) {
										if (topic.Slides.find(o => o.id === userLessonHistory.slideId).id > topic.Slides[0].id) {
											topicDto.userSlidesLength = topic.Slides.indexOf(topic.Slides.find(o => o.id === userLessonHistory.slideId)) + 1;
											topicDto.isEnabled = true;
										}
									}
								}
							}
						}
					}
				}

				model.lesson = {
					name: lesson.name,
					description: lesson.description,
					level: lesson.Level.name,
					topics: topicListDto,
					teacher: lesson.User.firstname + " " + lesson.User.lastname,
				};
				
				for (var i = 0; i < lesson.Topics.length; i++) {
					models.UserLessonHistory
					.findOrCreate({
						where: {
							userId: user.id,
							topicId: lesson.Topics[i].id
						},
						defaults: {
							userId: user.id,
							topicId: lesson.Topics[i].id,
							slideId: lesson.Topics[i].Slides[0].id
						}
					}); // Async for the purpose
				}
				
				res.json(model);
			});
		}
		
		soapClientAuthService(req.query, model, models, soapClientCallback);
	});
};