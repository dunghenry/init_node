const book = require('./book.route');
const site = require('./site.route');
const routes = (app) => {
    app.use('/', site);
    app.use('/api/v1/books', book);
};

module.exports = routes;
