const mongoose = require('mongoose'),
    { Category } = require('../models/category'),
    jwt = require('jsonwebtoken'),
    { User } = require('../models/user'),
    { Card } = require('../models/card')



const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}


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



    let token = getTokenFrom(req)

    console.log("token is", token)

    const decodedToken = jwt.verify(token, "secret")

    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }

    console.log("decodedToken is", decodedToken)

    let categoryAuthor = decodedToken.id

    let { categoryTitle } = req.body
    let categ = new Category({ title: categoryTitle, author: categoryAuthor })
    let categorySaved = await categ.save()
    let categoryId = categorySaved._id


    const user = await User.update(
        { _id: categoryAuthor },
        { $push: { categories: categoryId } }
    );

    console.log("user", user, "has updated the category!")


    console.log(categoryId)
    // returning the id.
    res.json(categoryId)
}

// GET: Have to order!
exports.getCategoriesAndPopulate = async function (req, res) {


    // 1) Getting token from headers authorization so that we can identify who is making the request.
    let token = getTokenFrom(req)

    console.log("token is", token)

    const decodedToken = jwt.verify(token, "secret")

    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }

    console.log("decodedToken is", decodedToken)

    let idUser = decodedToken.id

    console.log(idUser)
    console.log("type of idUser is", typeof (idUser))

    // 2) Getting the user info and then getting the categories of the user.
    const userPopulated = await User.findById(idUser).populate({
        path: 'categories',
        model: Category,
        populate: {
            path: 'cards',
            model: Card
        }
    })

    // 3) sending the categories of the user.
    res.json(userPopulated.categories)
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

    // 1) Getting token from headers authorization so that we can identify who is making the request.
    let token = getTokenFrom(req)

    console.log("token is", token)

    const decodedToken = jwt.verify(token, "secret")

    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }

    console.log("decodedToken is", decodedToken)
    console.log("deleting category...")

    let idUser = decodedToken.id

    try {
        let user = await User.findById(idUser)
    }
    catch (e) {
        console.log("user not found. invalid request")

        return res.status(401).json({ error: 'token missing or invalid' })
    }



    let categoryId = req.params.categoryId

    let deletedCategory = await Category.findByIdAndDelete({ _id: categoryId })

    console.log(deletedCategory)
    res.json(deletedCategory)
}

// UPDATE category title.  
exports.getOneCategoryAndUpdateTitle2 = async function (req, res) {

    // 1) token checking
    let token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, "secret")

    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }

    console.log("updating category...")

    let idUser = decodedToken.id

    console.log('idUser is', idUser)

    try {
        let user = await User.findById(idUser)
    }
    catch (e) {
        console.log("user not found. invalid request")

        return res.status(401).json({ error: 'token missing or invalid' })
    }




    // Above is token checking

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
