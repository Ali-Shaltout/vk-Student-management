var soapClientAuthService = require(__dirname + '/../auth/auth-client.service');
var constants = require(__dirname + '/../../app.constants');
var jwt = require('jsonwebtoken');

module.exports = function (app, sequelize, models) {
	app.post('/api/delete-lesson', function(req, res) {
		var model = {};

		var soapClientCallback = function (param, user) {
			if (!user) {
				// TODO: 401 error
				return res.json(null);
			}
			
			models.Lesson
			.destroy({
				where: { id: param.id, userId: user.id }
			})
			.then(function(isDeleted) {
				model.isDeleted = isDeleted;
				res.json(model);
			});		
		}
		
		soapClientAuthService(req.body, model, models, soapClientCallback);
	});
};