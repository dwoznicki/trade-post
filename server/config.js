var config = {};

config.secret = 'mysecret'
config.mongoURI = {
  development: 'mongodb://localhost/trade',
  test: 'mongodb://localhost/test'
};

module.exports = config;