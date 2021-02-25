const mongoose = require('mongoose'),
    { Category } = require('../models/category'),
    { Card } = require('../models/card'),
    { User } = require('../models/user'),
    jwt = require('jsonwebtoken')



const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

// 3.1) Cards route handiling
// POST
exports.createAndAddCardToCategory = async function (req, res) {

    // Do a request like:
    // fetch('http://localhost:5000/cards', {
    //     method: 'POST',
    //     headers: {'Content-Type':'application/json'},
    //     body: JSON.stringify({belongingCategoryId:"600c72f9ede8d760749aff3a" , cardTitle:"carta31Jan14:04" , cardBody:"testonuovo" })
    // });

    let token = getTokenFrom(req)

    console.log("token is", token)

    const decodedToken = jwt.verify(token, "secret")

    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    console.log("decodedToken is", decodedToken)

    let categoryAuthor = decodedToken.id


    let { belongingCategoryId, cardTitle, cardBody } = req.body

    // Creating card, saving it and retrieving the _id
    let card = new Card({ title: cardTitle, body: cardBody, category: belongingCategoryId })
    let savedCard = await card.save()

    const idCard = savedCard._id // also .id works!

    // Getting the category and updating the array of cards.
    const categ = await Category.findById(belongingCategoryId)
    categ.cards.push(idCard)


    // do not need to update the user! We would be adding again the category to the user!


    // populating after saving!
    let updatedCategoryContainingTheCard = await categ.save().then(t => t.populate('cards').execPopulate())



    console.log(`category updated! ${updatedCategoryContainingTheCard}`)
    res.json(updatedCategoryContainingTheCard)
}


// GET
exports.getAllCards = async function (req, res) {
    let cards = await Card.find()
    res.json(cards)
}


// 3.2) Card route handling (one single card)
// DELETE
exports.deleteCard = async function (req, res) {

    // 1) Getting token from headers authorization so that we can identify who is making the request.
    let token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, "secret")

    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }

    console.log("deleting card...")

    let idUser = decodedToken.id

    try {
        let user = await User.findById(idUser)
    }
    catch (e) {
        console.log("user not found. invalid request")

        return res.status(401).json({ error: 'token missing or invalid' })
    }


    // 2) deleting the card.
    let id = req.params.id
    let result = await Card.findByIdAndDelete(id)


    // result is what??? result is exactly the deleted card: {_id: ..., title: ..., body:... ,..}
    res.json(result)
}

// GET
exports.getCard = async function (req, res) {
    let id = req.params.id
    let card = await Card.findById(id)

    res.json(card)
}
// How to manage error handling? If card not found?


// PUT 
exports.getCardAndUpdate = async function (req, res) {
    /// Assuming our body will have two keys: "cardBody" and "cardTitle"


    // 1) Getting token from headers authorization so that we can identify who is making the request.
    let token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, "secret")

    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }

    console.log("updating card...")

    let idUser = decodedToken.id

    console.log('idUser is', idUser)

    try {
        let user = await User.findById(idUser)
    }
    catch (e) {
        console.log("user not found. invalid request")

        return res.status(401).json({ error: 'token missing or invalid' })
    }


    // This above will be a middleware in future.



    console.log("req.body is", req.body)
    console.log("type is", typeof (req.body))
    //// Note important: req.body works, but we have to be careful how to make the request!
    //// In our case, the request works if we send :
    ///
    //   fetch('http://localhost:5000/cards/card1234', {
    //     method: 'PUT',
    //     headers: {'Content-Type':'application/json'},
    //     body: JSON.stringify({a:12})
    //   });

    /// From js! . In which case req.body is already an object (we do not need to parse it!)


    let cardId = req.params.id
    let { cardTitle, cardBody } = req.body

    let updatedDocument = await Card.findByIdAndUpdate(cardId, { $set: { title: cardTitle, body: cardBody } }, { new: true }).exec()

    res.json(updatedDocument)

}

