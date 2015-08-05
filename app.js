var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    moment = require('moment');

mongoose.connect('mongodb://localhost/mabearnews');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    // yay!
    console.log("Connected to db");
});

app.use(bodyParser.json());

// Pull in routes
require('./routes/index')(app);

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});