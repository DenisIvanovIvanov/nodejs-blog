const routes = require('express').Router(),
      utils = require('../utils'),
      Post = require('../models/Post'),
      Tag = require('../models/Tag'),
      Comment = require('../models/Comment'),
      mongoose = require('mongoose'),
      app = require('express')();

routes.get('/post-add', utils.isLogged, (req, res) => {
    res.render('../views/pages/post/newpost');
});

routes.get('/post/:id', (req, res) => {
    var id = req.params.id,
        popular,
        tags,
        post;

    if (!app.locals.popularPost || !app.locals.tags) {
        popular = Post.find({}).sort({ "Comments": -1 }).populate('Comments').limit(5).exec();
        tags = Tag.find({}).exec();
        rPost = Post.findOne({ _id: id }).populate('Tags Comments').exec(); 
        
        Promise.all([popular, tags, rPost]).then(([popPost, allTags, rePost]) => {
            res.render('../views/pages/post/viewpost', { post: rePost, popularPost: popPost, tags: allTags });
        }).catch((err) => {
            if (err) return err;
        });
    } else {
        Post.findOne({ _id: id }).populate('Tags Comments').exec((err, result) => {
            if (err) return err;
            
            res.render('../views/pages/post/viewpost', { post: result });
        });
    }
});

routes.get('/post/edit/:id', [utils.isLogged, utils.isAdmin], (req, res) => {
    var id = req.params.id;

    Post.findOne({ _id: id }).populate('Tag Comments').exec((err, result) => {
        if (err) return err;

        res.render('../views/pages/post/editpost', { post: result });
    });
});

routes.post('/post/delete', [utils.isLogged, utils.isAdmin], (req, res) => {
    Post.findByIdAndRemove(req.body.id, (err, post) => {
        if (err) return err;

        res.send({
            delete: true
        });
    });
});

routes.post('/post/comment-add', utils.isLogged, (req, res) => {

    const comment = new Comment();
    comment.postid = mongoose.Types.ObjectId(req.body.postid);
    comment.Author = req.user.username;
    comment.Description = req.body.content;
    comment.CreatedOn = new Date();

    comment.save((err) => {
        if (err) return err;

        Post.update({ _id: req.body.postid }, {
            $push: {
                Comments: comment
            }
        }, { upsert: true }, (err, raw) => {
            // if there was error saving the comment to the post, delete it
            if (err) {
                Post.update({ _id: req.body.postid }, {
                    $pull: comment
                }, (rErr, deleteRaw) => {
                    if (rErr) return rErr;
                })
            };
            // reloade the page
            res.redirect(req.get('referer'));
        });
    });
});

routes.post('/post/comment-delete', [utils.isLogged, utils.isAdmin], (req, res) => {
    const id = req.body.id;
    const postId = req.body.postId;
    
    if (mongoose.Types.ObjectId.isValid(id)) {
        Comment.findByIdAndRemove({ _id: id }, (err, cRes) => {
            if (err) return err;

            Post.findOneAndUpdate({ _id: postId }, {
                $pull: {
                    Comments: id
                }
            }, (err, doc, dRes) => {
                if (err) console.log(err);

                res.redirect(req.get('referer'));
            });
        });
    }
});

routes.post('/post-add', utils.isLogged, (req, res) => {
    // save new post
    var post = new Post();

    post.savePost(req.user.username, req.body.Description, req.body.Title, req.body.Tag, (err) => {
       if (err) return err;
       
       res.redirect('/');
    });
});

module.exports = routes;
