'use strict';
module.exports = function(app) {
    var TransactionController = require('../controllers/transaction');
    var RegisterController = require('../controllers/register');

    app.route('/test')
        .get(TransactionController.test)
        .post(TransactionController.test);

    app.route('/transaction/create')
        .get(TransactionController.create)
        .post(TransactionController.create);

    app.route('/transaction/query')
        .get(TransactionController.query)
        .post(TransactionController.query);

    app.route('/register/admin')
        .get(RegisterController.admin)
        .post(RegisterController.admin);

    app.route('/register/user')
        .get(RegisterController.user)
        .post(RegisterController.user);

    app.use(function(req, res) {
        res.status(404).send({url: req.originalUrl + ' not found'})
    });
};
