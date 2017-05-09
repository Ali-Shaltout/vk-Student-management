module.exports = function(sequelize, DataTypes) {
	var Topic = sequelize.define("Topic", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		lessonId: DataTypes.INTEGER,
		name: DataTypes.STRING,
		sequenceNumber: DataTypes.INTEGER,
		isPublished: DataTypes.BOOLEAN
	});
	
	return Topic;
};