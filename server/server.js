// Basic setup
var http = require('http'),
		express = require('express'),
		app = express();
		config = require('./config'),
		mongoose = require('mongoose');

// Middleware
var bodyParser = require('body-parser'),
		jwt = require('jsonwebtoken');

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

var User = require('./models/user')

app.set('secret', config.secret)

app.get('/', function(req, res) {
	res.send("Hello! The API is at http://localhost:" + port + "/api")
});

app.get('/setup', function(req, res) {
	var tom = new User({
		name: "Tom",
		password: "password",
		admin: true
	});

	tom.save(function(err) {
		if (err) throw err;
		console.log(tom);
		res.json({success: true})
	})
})

// API ROUTES -------------------

// get an instance of the router for api routes
var apiRoutes = express.Router(); 

// TODO: route to authenticate a user (POST http://localhost:8080/api/authenticate)

apiRoutes.post('/authenticate', function(req, res) {
	console.log(req.body)
	User.findOne({
		name: req.body.name
	}, function(err, user) {
		if (err) throw err;
		if (!user) {
			res.json({success: false, message: 'Authentication failed. User not found.'})
		} else if (user) {
			if (user.password != req.body.password) {
				res.json({success: false, message: 'Authentication failed. Wrong password.'})
			} else {
				var token = jwt.sign(user, app.get('secret'), {
					expiresIn: "1 day"
				});
				res.json({
					success: true,
					message: "Enjoy your token!",
					token: token
				});
			}
		}
	});
});
// TODO: route middleware to verify a token
apiRoutes.use(function(req, res, next) {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	if (token) {
		jwt.verify(token, app.get('secret'), function(err, decoded) {
			if (err) {
				return res.json({success: false, message: 'Failed to authenticate token.'});
			} else {
				req.decoded = decoded;
				next();
			}
		});
	} else {
		return res.status(403).send({
			success: false,
			message: "No token provided."
		});
	}
});

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});


// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

// Start server
app.listen(port);
console.log("Server running on\nhttp://localhost:" + port);

// Expose app
module.exports = app;