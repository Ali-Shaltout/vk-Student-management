module.exports = function(sequelize, DataTypes) {
	var Lesson = sequelize.define("Lesson", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		userId: DataTypes.INTEGER,
		programmingLanguageId: DataTypes.INTEGER,
		levelId: DataTypes.INTEGER,
		name: DataTypes.STRING,
		description: DataTypes.STRING,
		isPublished: DataTypes.BOOLEAN
	});
	
	return Lesson;
};