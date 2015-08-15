var mongoose = require('mongoose'),
    findOrCreate = require('mongoose-findorcreate');
    


var personSchema = mongoose.Schema({
    info: {
	identifier: Number,
	firstname: {type: String, trim: true},
	lastname: {type: String, trim: true},
	email: {type: String, trim: true}
    },
    // 0: writer, 1: editor, 2: admin
    access_level: {type: Number, min: 0, max: 2}
});


personSchema.virtual('fullname').get(function () {
    return firstname + " " + lastname;
});

// TODO: find articles
personSchema.virtual('articles').get(function () {
    return ""
});

personSchema.plugin(findOrCreate);

var Person = mongoose.model('Person', personSchema);

module.exports = Person;
