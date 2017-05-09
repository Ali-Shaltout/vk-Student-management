module.exports = function(sequelize, DataTypes) {
	var Slide = sequelize.define("Slide", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		topicId: DataTypes.INTEGER,
		title: DataTypes.STRING,
		description: DataTypes.STRING,
		isAnswerable: DataTypes.BOOLEAN,
		answer: DataTypes.STRING,
		sequenceNumber: DataTypes.INTEGER,
		isPublished: DataTypes.BOOLEAN
	});
	
	return Slide;
};