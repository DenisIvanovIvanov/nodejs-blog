var express = require('express'),
    app = express(),
    config = require('./configurations/app_config'),
    routes = require('./routes/routes'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    passport = require('passport')
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    passportConfig = require('./configurations/passport'),
    flash = require('connect-flash');

mongoose.connect(config.dbUrl);

passportConfig(passport);

app.use(express.static('public')) // use static files
app.use(morgan('dev')); // log to console
app.use(cookieParser()); // more native cookie 
app.use(bodyParser()); // convert req to json

app.locals = require('./configurations/app_defaults');

// set view engine
app.set('view engine', 'ejs');

// set session secret
app.use(session({ secret: config.secret }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

routes(app, passport);

module.exports = app;