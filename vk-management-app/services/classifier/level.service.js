module.exports = function (app, sequelize, models) {
	app.get('/api/level-classifier', function(req, res) {
		var model = [];
		
		models.Level
		.findAll()
		.then(function(levels) {
			for (var i = 0; i < levels.length; i++) {
				model.push({
					id: levels[i].id,
					name: levels[i].name
				});
			}
			
			res.json(model);
		});
		
	});
};