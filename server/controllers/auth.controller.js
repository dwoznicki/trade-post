var passport = require('passport');
var User = require('../models/user');

var authController = (function(controller) {
	controller.register = function(req, res) {
		var newUser = new User({
			username: req.body.username
		});
		newUser.setPassword(req.body.password);

		newUser.save(function(err) {
			if (err) { return res.status(404).json(err); }
			var token = newUser.generateJWT();
			return res.status(200).json({token: token});
		});
	};
	controller.login = function(req, res) {
		passport.authenticate('local', function(err, user, info) {
			if (err) { return res.status(404).json(err); }
			if (user) {
				var token = user.generateJWT();
				return res.status(200).json({token: token});
			} else {
				return res.status(401).json(info);
			}
		})(req, res);
	};

	return controller;

})(authController || {});

module.exports = authController;