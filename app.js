var express = require('express'),
    app = express(),
    ids = require('ids.js'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    Person = require('models/person');

// Parse json of requests
app.use(bodyParser.json());

// Pull in routes
require('./routes/index')(app);

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});

mongoose.connect('mongodb://localhost/mabearnews');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    // yay!
    console.log("Connected to db");
});

passport.use(new GoogleStrategy(
    {
	consumerKey: ids.google.consumerKey,
	consumerSecret: ids.google.consumerSecret,
	callbackURL: ids.google.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
	
	Person.findOrCreate(
	    {
		id : { identifier: profile.id}
	    },
	    {
		id: {
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
