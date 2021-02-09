const mongoose = require('mongoose'),
    { Category } = require('../models/category')



// 2.1) Categories handling routes.
// POST
exports.createCategory = async function (req, res) {
    // Have to send a fetch of the type:
    // fetch("http://localhost:5000/categories", {
    //     method: 'POST',
    //     headers: {'Content-Type':'application/json'},
    //     body: JSON.stringify({categoryTitle: "Facultative"})
    // }).then(res => res.json()).then(console.log)
    // 
    // don't forget headers!


    let { categoryTitle } = req.body
    let categ = new Category({ title: categoryTitle })
    let categorySaved = await categ.save()
    let categoryId = categorySaved._id


    console.log(categoryId)
    // returning the id.
    res.json(categoryId)
}

// GET: Have to order!
exports.getCategoriesAndPopulate = async function (req, res) {


    let categories = await Category
        .find()
        .populate("cards", "title body")
    // console.log(categories)
    // even though the console doesn't populate, it has indeed populated. 
    // It just doesn't show them because of few space in the terminal

    // moreover, if the references to the other objects are existing ,but the referenced objects (cards)
    // have been deleted, then it doesn't show them!


    res.json(categories)
}




// 2.2) Single category handling routes. 
// GET
exports.getOneCategory = async function (req, res) {

    let categoryId = req.params.categoryId
    let doc = await Category
        .findById(categoryId)
        .populate("cards", "title body")

    console.log(doc)
    res.json(doc)
}



// DELETE 
exports.deleteOneCategory = async function (req, res) {

    let categoryId = req.params.categoryId

    let deletedCategory = await Category.findByIdAndDelete({ _id: categoryId })

    console.log(deletedCategory)
    res.json(deletedCategory)
}

// UPDATE category title.
exports.getOneCategoryAndUpdateTitle2 = async function (req, res) {

    let categoryId = req.params.categoryId

    let { categoryTitle } = req.body

    let updatedCategory = await Category.findByIdAndUpdate(categoryId, {
        $set: {
            title: categoryTitle
        }
    }, { new: true }).populate('cards')


    console.log(updatedCategory)
    res.json(updatedCategory)
}
