var User = require('../models/user');

var usersController = (function(controller) {
	controller.show = function(req, res) {
		if (!req.payload._id) {
			res.status(401).json({message: "Unauthorized Error: private profile"});
		} else {
			User.findById(req.payload._id).exec(function(err, user) {
				if (err) { return res.status(404).json(err); }
				return res.status(200).json(user);
			});
		}
	};

	return controller;

})(usersController || {});

module.exports = usersController;