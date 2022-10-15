const siteController = {
    getHomePage: async (req, res) => {
        return res.render('index', {
            title: 'Home Page',
        });
    },
};

module.exports = siteController;
