// ===============
// = Basic setup =
// ===============
var http = require('http');
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var dbConfig = require('./config/db.config');

// Set port and db connection
var port = process.env.PORT || 3000;
mongoose.connect(dbConfig.mongoURI[app.settings.env]);

// ==============
// = Middleware =
// ==============
var bodyParser = require('body-parser');
var passport = require('passport');

// Configure middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Require passport strategy config
require('./config/passport.config');
app.use(passport.initialize());

// ==================
// = Error Handling =
// ==================
app.use(function (err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
		res.status(401);
		res.json({"message" : err.name + ": " + err.message});
	}
});

// ===========
// = Routing =
// ===========
var router = express.Router();
var usersRoutes = require('./routes/users.routes');

router.use(function(req, res, next) {
	res.set('Access-Control-Allow-Origin', "*");
	res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	res.set('Access-Control-Allow-Headers', "Content-Type");
	res.set('Access-Control-Allow-Credentials', "true");
	next();
});

usersRoutes(router);

app.use('/api', router);

// Start server
app.listen(port);
console.log("Server running on\nhttp://localhost:" + port);

// Expose app
module.exports = app;