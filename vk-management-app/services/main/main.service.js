var soapClientAuthService = require(__dirname + '/../auth/auth-client.service');
var constants = require(__dirname + '/../../app.constants');
var jwt = require('jsonwebtoken');

module.exports = function (app, sequelize, models) {
	app.get('/api/student-main', function(req, res) {
		var model = {};
		
		var soapClientCallback = function (param, user) {
			if (!user) {
				// TODO: 401 error
				return res.json(null);
			}
			
			models.Lesson
			.findAll({
				where: {
					isPublished: true
				},
				include: [ 
				models.Level,
				models.ProgrammingLanguage,
				models.User,
				{ model: models.Topic, where: { isPublished: true }, include: [ { model: models.Slide, where: { isPublished: true } }, { model: models.UserLessonHistory, where: { userId: user.id }, required: false } ] }
				]
			})
			.then(function(lessons) {
				model.lessons = [];
				model.userLessons = [];
				
				for (var i = 0; i < lessons.length; i++) {
					var isUserLesson = false;
					var userLessonFinishedTopicCount = 0;
					var lessonDto = { // Forming DTO
						id: lessons[i].id,
						name: lessons[i].name,
						description: lessons[i].description,
						teacher: lessons[i].User.firstname + " " + lessons[i].User.lastname,
						level: lessons[i].Level.name,
						programmingLanguage: lessons[i].ProgrammingLanguage.name
					}
					
					for (var topicIndex = 0; topicIndex < lessons[i].Topics.length; topicIndex++) {
						if (lessons[i].Topics[topicIndex].UserLessonHistories) {
							for (var userLessonHistoryIndex = 0; userLessonHistoryIndex < lessons[i].Topics[topicIndex].UserLessonHistories.length; userLessonHistoryIndex++) {
								if (lessons[i].Topics[topicIndex].UserLessonHistories[userLessonHistoryIndex]) {
									isUserLesson = true;
									if (lessons[i].Topics[topicIndex].UserLessonHistories[userLessonHistoryIndex].isTopicFinished) {
										userLessonFinishedTopicCount++;
									}
								}
							}
						}
					}

					if (!isUserLesson) {
						model.lessons.push(lessonDto);
					}
					else if (isUserLesson) {
						lessonDto.isFinished = lessons[i].Topics.length === userLessonFinishedTopicCount;
						model.userLessons.push(lessonDto);
					}
				}

				res.json(model);
			});
		}
		
		soapClientAuthService(req.query, model, models, soapClientCallback);
	});
	
	app.get('/api/teacher-main', function(req, res) {
		var model = {};
		
		var soapClientCallback = function (param, user) {
			if (!user) {
				// TODO: 401 error
				return res.json(null);
			}
			
			models.Lesson
			.findAll({ where: { userId: user.id }, include: [models.Level, models.ProgrammingLanguage, models.User, {model: models.Topic, include: [models.Slide]}]})
			.then(function(lessons) {
				model.lessons = [];
				for (var i = 0; i < lessons.length; i++) {
					model.lessons.push({ // Forming DTO
						id: lessons[i].id,
						name: lessons[i].name,
						description: lessons[i].description,
						teacher: lessons[i].User.firstname + " " + lessons[i].User.lastname,
						level: lessons[i].Level.name,
						programmingLanguage: lessons[i].ProgrammingLanguage.name,
						isPublished: lessons[i].isPublished
					});
				}

				res.json(model);
			});
		}
		
		soapClientAuthService(req.query, model, models, soapClientCallback);
	});
	
	app.get('/api/profile-main', function(req, res) {
		var model = {};
		
		var soapClientCallback = function (param, user) {
			if (!user) {
				// TODO: 401 error
				return res.json(null);
			}
			
			model.userData.createdAt = user.createdAt;
			model.userData.email = user.email;

			res.json(model);
		}
		
		soapClientAuthService(req.query, model, models, soapClientCallback);
	});
};