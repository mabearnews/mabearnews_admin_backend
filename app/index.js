var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var moment = require('moment');

mongoose.connect('mongodb://localhost/mabearnews');

var db = mongoose.connection;

var articleSchema = mongoose.Schema({
    full_title: {type: String, trim: true},
    url_title: {type: String, trim: true, lowercase: true},
    author: {
	firstname: String,
	lastname: String,
	profile_page: String,
    },
    meta: {
	date: { type: Date, default: Date.now },
	published: Boolean,
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
});

app.post('/api/articles/save', function (req, res) {
    var article = new Article(req.body);

    // Convert date to unix
    article.meta.date = moment(article.meta.date);

    // Check for duplicate url
    Article.count({url_title: article.url_title }, function(err, count){
	if(count === 0){
	    // No dup, save new doc
	    article.save(function (err) {
		console.error(err);
	    });
	    
	    res.send("Saved");
	} else {
	    // Dup, respond with error
	    // TODO: fix magic error string
	    res.send("Error: Duplicate url_title, doccument rejected");
	}
    });
});

app.get('/api/articles/delete/:urltitle', function (req, res) {
    var title = req.params.urltitle;

    var callback = function (err, articles) {
	if (err) return handleError(err);
	if(articles.length === 0){
	    res.send("Error: No Articles found");
	} else {
	    for(var i = 0; i < articles.length; i++){
		articles[i].remove();
	    }
	    res.send("Removed");
	}
	};
	
	var query = Article.find().
	    where('url_title').equals(title).
	    exec(callback);
});


// Avalible params:
// weeks: integer value for how many weeks of articles to return
// max_articles: interger value for the max number of articles to return
// published_only: boolean value, true excludes unpublished articles, defaults to true
app.get('/api/articles', function (req, res) {
    // ex: /api/articles?weeks=2
    var weeksAgo = req.query.weeks;
    var max_articles = req.query.max_articles;
    var published_only = req.query.published_only;

    console.log(weeksAgo);
    console.log(max_articles);
    console.log(published_only);

    
    var query = {};
    if(weeks !== null) {
	var now = moment().toDate();
	var lastTime = moment().subtract(weeksAgo, 'weeks').toDate();
	query.'meta.date' = { $gt: lastTime, $lt: now };
    }

    if(published_only !== null) {
	
    }

    console.log(query);
    
    

    if(JSON.stringify(req.query) === "{}") {
	// No params, send it all
	Article.find(function (err, articles) {
	    if (err) return console.error(err);
	    res.send(articles);
	});
    } else {
	// Week param given
	var now = moment().toDate();
	var lastTime = moment().subtract(weeksAgo, 'weeks').toDate();
	
	var callback = function (err, articles) {
	    if (err) return handleError(err);
	    res.send(articles);
	};
	
	var query = Article.find().
	    where('meta.date').gt(lastTime).lt(now).
	    where('meta.published').
	    exec(callback);
    }
});



var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
