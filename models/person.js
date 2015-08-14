var mongoose = require('mongoose'),
    findOrCreate = require('mongoose-findorcreate');
    


var personSchema = mongoose.Schema({
    // From oauth
    id: {
	identifier: Number,
	firstname: {type: String, trim: true},
	lastname: {type: String, trim: true},
	email: {type: String, trim: true},
    }
    // 0: writer, 1: editor, 2: admin
    access_level: {type: Number, min: 0, max: 2}
});

authorSchema.virtual('fullname').get(function () {
    return firstname + " " + lastname;
});

authorSchema.virtual('articles').get(function () {
    
});

personSchema.plugin(findOrCreate);

var Person = mongoose.model('Person', personSchema);

model.exports = Person;
