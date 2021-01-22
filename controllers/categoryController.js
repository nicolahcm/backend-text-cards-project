const mongoose = require('mongoose'),
    { Category } = require('../models/category')



// 2.1) Categories handling routes.
// POST
exports.createCategory = async function (title) {
    let categ = new Category({ title: title })
    categ.save((err, categ) => console.log(`category Saved! id is ${categ.id}`))

    // We have to return the ID!!! Use await! 
}

// GET 1:
exports.getCategories = async function () {
    let categories = await Category.find({})
    console.log(categories)
}

// GET 2:
exports.getCategoriesAndPopulate = async function () {
    let categories = await Category
        .find()
        .populate("cards", "title body")
    console.log(categories)
    // even though the console doesn't populate, it has indeed populated. 
    // It just doesn't show them because of few space in the terminal

    // moreover, if the references to the other objects are existing ,but the referenced objects (cards)
    // have been deleted, then it doesn't show them!
}




// 2.2) Single category handling routes. 
// GET
exports.getOneCategory = async function (categoryId) {
    let doc = await Category.findById(categoryId) // doc is the document category with that id.

    console.log(doc)
}

// DELETE 
exports.deleteOneCategory = async function (categoryId) {
    Category.findByIdAndDelete({ _id: categoryId }, (err, doc) => { console.log(`${doc} has been deleted`) })
}

// UPDATE category title.
// 1st way of doing it: retrieving, modifying on backend, and saving on db
exports.getOneCategoryAndUpdateTitle1 = async function (categoryId, titleUpdate) {

    let category = await Category.findById(categoryId)
    category.title = titleUpdate
    category.save().then((res) => console.log(`res updated! ${res}`))
}


// 2nd way of doing it: modifying directly in the db:
exports.getOneCategoryAndUpdateTitle2 = async function (categoryId, titleUpdate) {

    let result = await Category.updateOne({ _id: categoryId }, {
        $set: {
            title: titleUpdate
        }
    })

    console.log(result)
}
