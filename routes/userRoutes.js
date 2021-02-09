const User = require('../models/user')

module.exports = function (app) {

    const userController = require('../controllers/userController')

    app.post("/api/users/register", userController.createUser)

    app.post("/api/users/login", userController.validateUser)

}