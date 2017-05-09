var soap = require('soap');
var url = 'http://localhost:8001/auth?wsdl';
var jwt = require('jsonwebtoken');
var constants = require(__dirname + '/../../app.constants');

module.exports = function (data, model, dbModels, callback) {
	soap.createClient(url, function(error, client) {
		if (error) {
			console.log(error);
		}
		
		var soapParam = {}; // I love workarounds <3
		if (data.hasOwnProperty('token')) {
			soapParam.token = data.token;
			soapParam.nothing = "";
		}
		else {
			soapParam.email = data.email;
			soapParam.password = data.password;
		}
		
		client.describe().authService.authPort;
		client.memorize(soapParam, function(err, token) {
			if (err) {
				console.log(err);
			}
			
			// Response from web service
			model.token = token;
			
			if (model.token.isAuthenticated === "true") {
				dbModels.User
				.findOne({ where: {
					hashId: model.token.key.userHashId
				},
				include: [
					dbModels.Role
				]
				})
				.then(function(user) {
					if (user) {
						model.userData = {};
						model.userData.firstname = user.firstname;
						model.userData.lastname = user.lastname;
						model.userData.role = user.Role.name;
						model.token.key = jwt.sign(model.token.key, constants.SECRET_KEY);
					}

					callback(data, user);
				});
			}
			else {
				callback(data, null);
			}
		});
	});
};