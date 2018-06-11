var localStrategy = require('passport-local').Strategy,
    User = require('../models/User');

module.exports = function(passport) {

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

    passport.use('local-signup', new localStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, username, password, done) => {

        process.nextTick(() => {
            User.findOne({ 'username': username }, (err, user) => {
                
                if (err) return done(err);

                if (user) {
                    return done(null, false, req.flash('signupMessage', 'This e-mail already exists.'));
                } else {
                    var newUser = new User();

                    newUser.username = username;
                    newUser.email = req.body.email;
                    newUser.password = newUser.generateHash(password);
                    newUser.role = "member"; // default;
                    
                    newUser.save((err) => {
                        if (err) throw err;
                        
                        return done(null, newUser, req.flash('signupMessage', 'User successfully created.'));
                    });
                }
            })
        });
    }));

    passport.use('local-login', new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, email, password, done) => {

        User.findOne({ 'email': email }, (err, user) => {
            if (err) return done(err);

            if (!user) {
                return done(null, false, req.flash('loginMessage', 'There is no such user!'));
            }

            if (!user.validPassword(password)) {
                return done(null, false, req.flash('loginMessage', 'Incorrect password!'));
            }

            return done(null, user);
        });

    }))
}