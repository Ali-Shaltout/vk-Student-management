module.exports = function (instance) {
	instance.models.User.belongsTo(instance.models.Role, { foreignKey: 'roleId' });
	instance.models.Lesson.belongsTo(instance.models.Level, { foreignKey: 'levelId' });
	instance.models.Lesson.belongsTo(instance.models.ProgrammingLanguage, { foreignKey: 'programmingLanguageId' });
	instance.models.Lesson.belongsTo(instance.models.User, { foreignKey: 'userId' });
	instance.models.Lesson.hasMany(instance.models.Topic, { foreignKey: 'lessonId' });
	instance.models.Topic.hasMany(instance.models.Slide, { foreignKey: 'topicId' });
	instance.models.Topic.belongsTo(instance.models.Lesson, { foreignKey: 'lessonId' });
	instance.models.Topic.hasMany(instance.models.UserLessonHistory, { foreignKey: 'topicId' });
	instance.models.Slide.belongsTo(instance.models.Topic, { foreignKey: 'topicId' });
	instance.models.UserLessonHistory.belongsTo(instance.models.Topic, { foreignKey: 'topicId' });
};