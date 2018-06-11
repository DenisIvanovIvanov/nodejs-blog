var mongoose = require('mongoose'),
    Post = require('./Post');

var CommentSchema = new mongoose.Schema({
    _postId: {
        type: String,
        ref: 'Post' 
    },
    Author: String,
    Description: String,
    CreatedOn: Date,
    LastEditBy: Date
});

module.exports = mongoose.model('Comment', CommentSchema);