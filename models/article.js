var mongoose = require('mongoose');

var articleSchema = mongoose.Schema({
    meta: {
	full_title: {type: String, trim: true},
	url_title: {type: String, trim: true, lowercase: true},
	author: {type: Schema.Types.ObjectId, ref: 'person'},
	date: { type: Date, default: Date.now },
	// 0: writing, 1: needs review, 2: published on site
	// 0 and 1 can be set by anyone, 2 only be editors
	status: {type: Number, min: 0, max: 2},
	// What kind of article eg: headliner or sports blog post
	// Set by anyone
	type: {type: String, trim: true, lowercase: true},
	// Links to simiarly tagged topics
	tags: [String]
    }
    content: {
	body_markdown: String,
	image_urls: [String],
	media_url: String
    }
});

var Article = mongoose.model('Article', articleSchema);

module.exports = Article;
