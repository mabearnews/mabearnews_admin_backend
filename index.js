var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var moment = require('moment');

mongoose.connect('mongodb://localhost/mabearnews');

var db = mongoose.connection;

var articleSchema = mongoose.Schema({
    title: String,
    author: {
	firstname: String,
	lastname: String,
	profile_page: String,
    },
    meta: {
	date: { type: Date, default: Date.now },
	tags: [String]
    },
    content: {
	body_markdown: String,
	image_urls: [String],
	media_url: String
    }
});

var Article = mongoose.model('Article', articleSchema);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    // yay!
    console.log("Connected to db");
});

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Will send SPA');
});

app.get('/api', function (req, res) {
    res.send("API doc will be here");
    
    Article.find(function (err, articles) {
	if (err) return console.error(err);
	console.log("reading...");
	console.log(articles);
    });
});

app.post('/api/articles/save', function (req, res) {
    console.log(req.body);
    var article = new Article(req.body);

    // Convert date to unix
    article.meta.date = moment(article.meta.date);

    article.save(function (err) {
	console.error(err);
    });
    
    res.send("Sent");
});

app.get('/api/articles/all', function (req, res) {
    Article.find(function (err, articles) {
	if (err) return console.error(err);
	res.send(articles);
    });
});

app.get('/api/articles', function (req, res) {
    var weeksAgo = req.param('weeks');

    var now = moment().toDate();
    var lastTime = moment().subtract(weeksAgo, 'weeks').toDate();

    var callback = function (err, articles) {
	if (err) return handleError(err);
	res.send(articles);
    };
    
    var query = Article.find().
	where('meta.date').gt(lastTime).lt(now).
	exec(callback);
});



var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
