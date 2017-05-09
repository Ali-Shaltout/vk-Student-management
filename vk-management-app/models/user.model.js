module.exports = function(sequelize, DataTypes) {
	var User = sequelize.define("User", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		hashId: DataTypes.STRING,
		roleId: DataTypes.INTEGER,
		firstname: DataTypes.STRING,
		lastname: DataTypes.STRING,
		email: DataTypes.STRING,
		password: DataTypes.STRING,
		createdAt: DataTypes.DATE
	});
	
	return User;
};