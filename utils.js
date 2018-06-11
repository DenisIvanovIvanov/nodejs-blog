var utils = {
    
    logIn: function logIn(req, res, next, app) {
        app.locals.isLogged = req.isAuthenticated();
        return next();
    },

    isLogged: function isLogged(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        res.redirect('/');
    },

    isAdmin: function isAdmin(req, res, next) {
        if (req.user.role === 'admin') {
            return next();
        }

        res.redirect('/');
    }
}

module.exports = utils;