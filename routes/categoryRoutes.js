
module.exports = function (app) {
    const categoryController = require('../controllers/categoryController.js')

    app.get('/categories', categoryController.getCategoriesAndPopulate)
    app.post('/categories', categoryController.createCategory)



    app.get('/categories/:categoryId', categoryController.getOneCategory)
    app.delete('/categories/:categoryId', categoryController.deleteOneCategory)
    app.put('/categories/:categoryId', categoryController.getOneCategoryAndUpdateTitle2)
}