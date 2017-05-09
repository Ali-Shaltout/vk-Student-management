module.exports = function(sequelize, DataTypes) {
	var ProgrammingLanguage = sequelize.define("ProgrammingLanguage", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: DataTypes.STRING
	});
	
	return ProgrammingLanguage;
};