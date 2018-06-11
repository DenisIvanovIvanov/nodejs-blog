var mongoose = require('mongoose'),
    Comment = require('./Comment'),
    Tag = require('./Tag');

var PostSchema = new mongoose.Schema({
    Author: String,
    Title: String,
    Description: String,
    Comments: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Comment'   
    }],
    Tags: [{
        type: mongoose.Schema.Types.String, ref: 'Tag'
    }],
    CreatedOn: Date,
    LastEditOn: Date
});

PostSchema.methods.savePost = function (auth, descr, title, tags, callback) {
    this.Author = auth;
    this.Description = descr;
    this.Title = title;
    this.CreatedOn = new Date();
    
    if (tags && tags.length > 0) {
        tags = tags.split(' ');

        tags.forEach(element => {
            var tag = new Tag({
                _id: element
            });
            
            this.Tags.push(tag);

            tag.save();
        });
    }
    this.save(callback);
    
}

mongoose.model('Post', PostSchema);

module.exports = mongoose.model('Post');