module.exports = function(sequelize, DataTypes) {
	var UserLessonHistory = sequelize.define("UserLessonHistory", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		topicId: DataTypes.INTEGER,
		userId: DataTypes.INTEGER,
		slideId: DataTypes.INTEGER,
		isTopicFinished: DataTypes.BOOLEAN
	});
	
	return UserLessonHistory;
};