var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    ids = require('./ids'),
    Person = require('./models/person');


var IP = process.env.MONGO_PORT_27017_TCP_ADDR;
var PORT = process.env.MONGO_PORT_27017_TCP_PORT;

if((IP === undefined) || (PORT === undefined)){
    // Simple local setup
    mongoose.connect('mongodb://localhost/mabearnews');
} else {
    // docker
    console.log("docker detected");
    mongoose.connect('mongodb://' + IP + ':' + PORT + '/mabearnews');
}

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    // yay!
    console.log("Connected to db");
});

passport.use(new GoogleStrategy(
    {
	clientID: ids.google.clientID,
	clientSecret: ids.google.clientSecret,
	callbackURL: ids.google.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
	
	Person.findOrCreate(
	    {
		info : { identifier: profile.id}
	    },
	    {
		info: {
		    firstname: profile.givenName,
		    lastname: profile.familyName,
		    email: profile.emails[0].value
		},
		// TODO: Access logic
		access_level: 2
	    },
	    function (err, user) {
		return done(err, user);
	    });
    }
));

// Parse json of requests
app.use(bodyParser.json());

// Pull in routes
require('./routes/index')(app);

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});
