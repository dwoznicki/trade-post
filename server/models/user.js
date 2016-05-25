var mongoose = require('mongoose'),
		crypto = require('crypto'),
		jwt = require('jsonwebtoken'),
		env = require('node-env-file')

var UserSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true
	},
	hash: String,
	salt: String
});

UserSchema.methods.setPassword = function(password) {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function(password) {
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
	return this.hash === hash;
};

UserSchema.methods.generateJWT = function() {
	return jwt.sign({
		_id: this._id,
		username: this.username
	}, process.env.JWT_SECRET, {expiresIn: "7 days"});
};

module.exports = mongoose.model('User', UserSchema);