const routes = require('express').Router(),
      passport = require('passport');

routes.get('/login', (req, res) => {
    res.render('../views/pages/login', { message: req.flash('loginMessage') });
});

routes.get('/signup', (req, res) => {
    res.render('../views/pages/signup', { message: req.flash('signupMessage') });
});

routes.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

routes.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
}));

routes.post('/login', passport.authenticate('local-login', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash: true
}));

module.exports = routes;