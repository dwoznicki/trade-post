// Basic setup
var http = require('http'),
		express = require('express'),
		app = express();

// Require db related
var mongoose = require('mongoose'),
		config = require('./_config')

// Middleware
var bodyParser = require('body-parser');

// Set port and db connection
var port = process.env.PORT || 3000;
mongoose.connect(config.mongoURI[app.settings.env]);

// Configure middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Create router and set routes
var router = express.Router();

router.use(function(req, res, next) {
	res.set('Access-Control-Allow-Origin', "*");
	res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	res.set('Access-Control-Allow-Headers', "Content-Type");
	res.set('Access-Control-Allow-Credentials', "true");
	next();
});



// Start server
app.listen(port);
console.log("Server running on\nhttp://localhost:" + port)

// Expose app
module.exports = app;