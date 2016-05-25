var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = require('../models/user')

passport.use(new LocalStrategy(
	function(username, password, done) {
		User.findOne({username: username}, function(err, user) {
			if (err) { return done(err); }
			// Return if user isn't found
			if (!user) {
				return done(null, false, {message: "User not found."});
			}
			// Return if password is incorrect
			if (!user.validPassword(password)) {
				return done(null, false, {message: "Incorrect password."});
			}
			// Return if everythign is correct
			return done(null, user);
		});
	}
));