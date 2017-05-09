module.exports = function (app, sequelize, models) {
	app.get('/api/role-classifier', function(req, res) {
		var model = [];
		
		models.Role
		.findAll()
		.then(function(roles) {
			for (var i = 0; i < roles.length; i++) {
				model.push({
					id: roles[i].id,
					name: roles[i].name
				});
			}
			
			res.json(model);
		});
		
	});
};