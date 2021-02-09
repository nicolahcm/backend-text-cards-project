const mongoose = require('mongoose'),
    { Category } = require('../models/category'),
    { Card } = require('../models/card')




// 3.1) Cards route handiling
// POST
exports.createAndAddCardToCategory = async function (req, res) {

    // Do a request like:
    // fetch('http://localhost:5000/cards', {
    //     method: 'POST',
    //     headers: {'Content-Type':'application/json'},
    //     body: JSON.stringify({belongingCategoryId:"600c72f9ede8d760749aff3a" , cardTitle:"carta31Jan14:04" , cardBody:"testonuovo" })
    // });



    let { belongingCategoryId, cardTitle, cardBody } = req.body

    // Creating card, saving it and retrieving the _id
    let card = new Card({ title: cardTitle, body: cardBody })
    let savedCard = await card.save()

    const idCard = savedCard._id // also .id works!

    // Getting the category and updating the array of cards.
    const categ = await Category.findById(belongingCategoryId)
    categ.cards.push(idCard)


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

