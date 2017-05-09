var express = require('express');
var app = express();
var Promise = require('bluebird');
var Connection = require('sequelize-connect');
var discover = [__dirname + '/models'];
var orm = new Connection('vKdB.sql', 'root', '',
{
	dialect: "mysql",
	port:    4040
},
discover);

var initAppConfiguration = require('./app.configuration');
initAppConfiguration(express, app);

Promise.resolve(orm).then(function(instance) {
	require('./models.configuration')(instance);
	
	var initLevelClassifierService = require('./services/classifier/level.service');
	initLevelClassifierService(app, instance.sequelize, instance.models);
	
	var initProgrammingLanguageClassifierService = require('./services/classifier/programming-language.service');
	initProgrammingLanguageClassifierService(app, instance.sequelize, instance.models);
	
	var initLecturerClassifierService = require('./services/classifier/lecturer.service');
	initLecturerClassifierService(app, instance.sequelize, instance.models);
	
	var initRoleClassifierService = require('./services/classifier/role.service');
	initRoleClassifierService(app, instance.sequelize, instance.models);
	
	var initLoginService = require('./services/login/login.service');
	initLoginService(app, instance.sequelize, instance.models);
	
	var initRegisterService = require('./services/register/register.service');
	initRegisterService(app, instance.sequelize, instance.models);
	
	var initMainService = require('./services/main/main.service');
	initMainService(app, instance.sequelize, instance.models);
	
	var initStartLessonService = require('./services/lesson/start-lesson.service');
	initStartLessonService(app, instance.sequelize, instance.models);
	
	var initEditLessonService = require('./services/lesson/edit-lesson.service');
	initEditLessonService(app, instance.sequelize, instance.models);
	
	var initCreateLessonService = require('./services/lesson/create-lesson.service');
	initCreateLessonService(app, instance.sequelize, instance.models);
	
	var initPublishLessonService = require('./services/lesson/publish-lesson.service');
	initPublishLessonService(app, instance.sequelize, instance.models);
	
	var initDeleteLessonService = require('./services/lesson/delete-lesson.service');
	initDeleteLessonService(app, instance.sequelize, instance.models);
	
	var initStartTopicService = require('./services/topic/start-topic.service');
	initStartTopicService(app, instance.sequelize, instance.models);
	
	var initEditTopicService = require('./services/topic/edit-topic.service');
	initEditTopicService(app, instance.sequelize, instance.models);
	
	var initCreateTopicService = require('./services/topic/create-topic.service');
	initCreateTopicService(app, instance.sequelize, instance.models);
	
	var initPublishTopicService = require('./services/topic/publish-topic.service');
	initPublishTopicService(app, instance.sequelize, instance.models);
	
	var initDeleteTopicService = require('./services/topic/delete-topic.service');
	initDeleteTopicService(app, instance.sequelize, instance.models);
	
	var initCreateSlideService = require('./services/slide/create-slide.service');
	initCreateSlideService(app, instance.sequelize, instance.models);
	
	var initPublishSlideService = require('./services/slide/publish-slide.service');
	initPublishSlideService(app, instance.sequelize, instance.models);
	
	var initDeleteSlideService = require('./services/slide/delete-slide.service');
	initDeleteSlideService(app, instance.sequelize, instance.models);
	
	var initEditSlideService = require('./services/slide/edit-slide.service');
	initEditSlideService(app, instance.sequelize, instance.models);
	
	var initNextSlideService = require('./services/slide/next-slide.service');
	initNextSlideService(app, instance.sequelize, instance.models);
	
	var initChangePasswordService = require('./services/user/change-password.service');
	initChangePasswordService(app, instance.sequelize, instance.models);
	
	var initChangePersonalInfoService = require('./services/user/change-personal-info.service');
	initChangePersonalInfoService(app, instance.sequelize, instance.models);
});


