var constants = require(__dirname + '/../../app.constants');
var soap = require('soap');
var wsdl = require('fs').readFileSync('auth.wsdl', 'utf8');
var express = require('express');
var expressServer = express();
var jwt = require('jsonwebtoken');
var Promise = require('bluebird');
var Connection = require('sequelize-connect');
var discover = [__dirname + '/../../models'];
var orm = new Connection(
'vk-auth',
'root',
'',
{
  dialect: "mysql",
  port:    3306
},
discover
);

var service = {
    authService : {
        authPort : {
            memorize: function (params, callback) {
				if (params.token) {
					var parseToken = JSON.parse(params.token);
					jwt.verify(parseToken.key, constants.SECRET_KEY, function(err, decoded) {
						if (err) {
							return callback({
								isAuthenticated: false, key: null
							}); // Incorrect token key || by passing null user token will be cleared
						}
						else {
							if (decoded.iat <= Math.floor(Date.now() / 1000)) { // Somewhy user was so inactive that his token expired
								return callback({
									isAuthenticated: false, key: null
								}); 
							}
							else {
								decoded.iat = Math.floor(Date.now() / 1000) + 60 * 60; // Basically, updating token key every time when user calling *ring ring
								return callback({
									isAuthenticated: true, key: decoded
								});
							}
						}
					});
				}
				else {
					Promise.resolve(orm).then(function(instance) {
							instance.models.User.findOne({ where: { email: params.email, password: params.password }}).then(function(user) { // TODO: implement user management queries to UDDI protocol
							if (!user) {
								return callback({
									isAuthenticated: false, key: null
								});
							}
							else {
								var userData = { userHashId: user.hashId, iat: Math.floor(Date.now() / 1000) + 60 * 60 };
								return callback({
									isAuthenticated: true, key: userData
								});
							}
						});
					});
				}
            }
        }
    }
};

var server = expressServer.listen(8001, function(){
      var soapServer = soap.listen(expressServer, '/auth', service, wsdl);
});