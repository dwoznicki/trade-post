var jwt = require('express-jwt');
var env = require('node-env-file');

env(__dirname + './../../.env');

var jwtAuth = jwt({
	secret: process.env.JWT_SECRET,
	userProperty: 'payload'
});

module.exports = function(router) {
	var auth = require('../controllers/auth.controller');
	var users = require('../controllers/users.controller');

	router.route('/register')
		.post(auth.register)

	router.route('/login')
		.post(auth.login)

	router.route('/profile')
		.get(jwtAuth, users.show)
};