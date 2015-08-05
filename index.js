var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Article = require('./models/article'),
    moment = require('moment');

mongoose.connect('mongodb://localhost/mabearnews');

var db = mongoose.connection;

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
// max_articles: interger value for the max number of articles to return, defaults to unlimited
// published_only: boolean value, true excludes unpublished articles, defaults to true
app.get('/api/articles', function (req, res) {
    // ex: /api/articles?weeks=2
    var weeks = req.query.weeks;
    var max_articles = parseInt(req.query.max_articles);
    var published_only = req.query.published_only;

    var query_params = {};
    
    if(typeof weeks !== 'undefined') {
	weeks = parseInt(weeks);

	var now = moment().toDate();
	var lastTime = moment().subtract(weeks, 'weeks').toDate();
	Object.defineProperty(query_params, 'meta.date', {
	    value: { "$gt": lastTime, "$lt": now },
	    writable: true,
	    configurable: true,
	    enumerable: true
	});
    }

    if(typeof max_articles !== 'undefined') {
	max_articles = parseInt(max_articles);
    } else {
	// Unlimited is zero, default behavior
	max_articles = 0;
    }
    
    if(typeof published_only !== 'undefined') {
	published_only = (published_only.toLowerCase() === 'true');
	Object.defineProperty(query_params, 'meta.published', {
	    value: published_only,
	    writable: true,
	    configurable: true,
	    enumerable: true
	});
    }
    
    console.log(typeof weeks);
    console.log(typeof max_articles);
    console.log(typeof published_only);

    console.log(query_params);
    
    Article.find(query_params).
	sort({'meta.date': -1}).
	limit(max_articles).
	exec(function(err, articles) {
	    if (err) return console.error(err);
	    res.send(articles);
	});
});



var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
