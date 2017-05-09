module.exports = function (app, sequelize, models) {
	app.get('/api/programming-language-classifier', function(req, res) {
		var model = [];
		
		models.ProgrammingLanguage
		.findAll()
		.then(function(programmingLanguages) {
			for (var i = 0; i < programmingLanguages.length; i++) {
				model.push({
					id: programmingLanguages[i].id,
					name: programmingLanguages[i].name
				});
			}
			
			res.json(model);
		});
		
	});
};