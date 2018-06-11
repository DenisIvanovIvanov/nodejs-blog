var mongoose = require('mongoose');

var TagSchema = new mongoose.Schema({
    _id: String
});

module.exports = mongoose.model('Tag', TagSchema);