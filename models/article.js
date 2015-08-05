var mongoose = require('mongoose');

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

module.exports = Article;
