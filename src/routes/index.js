const book = require('./book.route');
const site = require('./site.route');
const user = require('./user.route');
const auth = require('./auth.route');
const routes = (app) => {
    app.use('/', site);
    app.use('/api/v1/books', book);
    app.use('/api/v1/users', user);
    app.use('/api/v1/auth', auth);
};

module.exports = routes;
