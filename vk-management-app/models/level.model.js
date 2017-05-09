module.exports = function(sequelize, DataTypes) {
	var Level = sequelize.define("Level", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: DataTypes.STRING
	});
	
	return Level;
};