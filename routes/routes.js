var path = require('path'),
    Post = require('../models/Post'),
    Tag = require('../models/Tag'),
    utils = require('../utils'),
    config = require('../configurations/app_config'),
    postRoutes = require('./post-routes'),
    authRoutes = require('./auth-routes');

module.exports = function routes(app, passport) {
    /* Load separate routes */

    app.use('/', postRoutes);
    app.use('/', authRoutes);

    /* End separate routes */

    /* Main routes */

    app.get('/', (req, res, next) => {
        utils.logIn(req, res, next, app);
    }, (req, res) => {
        var pageNumber = req.query.page == undefined ? 1 : req.query.page,
            popular = Post.find({}).sort({ "Comments": -1 }).populate('Comments').limit(5).exec(),
            sorted,
            postSize,
            tags;
        
        // page number will be the page to sort
        if (pageNumber) {
            sorted = Post.find({}).skip((pageNumber - 1) * config.page_size).limit(config.page_size).sort({ CreatedOn: -1 }).populate('Tags Comments').exec();
        } else {
            sorted = Post.find({}).limit(config.page_size).sort({ CreatedOn: -1 }).populate('Tags Comments').exec();
        }

        // used to calculate the number of pages
        postSize = Post.count().exec();
        tags = Tag.find({}).exec();

        // we want everything to be fetched before rendered and async sucks in this case
        Promise.all([sorted, popular, postSize, tags]).then(([sortedPosts, mostPopular, count, allTags]) => {
            // push in app locals so we can access them in other templates without have to fetch them again from db
            // ... eventually
            app.locals.popularPost = mostPopular; 
            app.locals.user = req.user;
            app.locals.pages = Math.ceil(count / config.page_size);
            app.locals.current = pageNumber;
            app.locals.tags = allTags;

            res.render('../views/pages/index', { post: sortedPosts });
        }).catch((err) => {
            console.log(err);
        });
    });

    app.get('/about', (req, res) => {
        res.render('../views/pages/about');
    });

    app.get('/contact', (req, res) => {
        res.render('../views/pages/contact');
    });

    /* end main routes */
}