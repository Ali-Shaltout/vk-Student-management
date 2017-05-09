module.exports = function (app, sequelize, models) {
	app.get('/api/lecturer-classifier', function(req, res) {
		var model = [];
		
		models.Lesson
		.findAll({
			where: {
				isPublished: true
			},
			include: [
				{ model: models.User },
			],
			order: [
				[ models.User, 'lastname', 'ASC' ]
			]
		})
		.then(function(lessons) {
			for (var i = 0; i < lessons.length; i++) {
				model.push(
					lessons[i].User.firstname + " " + lessons[i].User.lastname
				);
			}
			
			model = model.filter(function(elem, pos) { // distinct
				return model.indexOf(elem) == pos;
			});
			
			res.json(model);
		});
		
	});
};