const mongoose = require('mongoose'),
    { Category } = require('../models/category'),
    { Card } = require('../models/card')




// 3.1) Cards route handiling
// POST
exports.createAndAddCardToCategory = async function (catId, cardTitle, cardBody) {

    // Creating card, saving it and retrieving the _id
    let card = new Card({ title: cardTitle, body: cardBody })
    let savedCard = await card.save()
    const idCard = savedCard.id

    // Getting the category and updating the array of cards.
    const categ = await Category.findOne({ _id: catId })
    categ.cards.push(idCard)
    categ.save().then(res => console.log(`card added`))
}


// GET
exports.getOneCard = async function (cardId) {
    let card = await Card.findById(cardId)
    console.log(card)
}


// 3.2) Card route handling (one single card)
// DELETE
exports.deleteCard = async function (cardId) {
    Card.findByIdAndDelete(cardId).then((res) => console.log(`card eliminated! ${res}`))
}

// GET
exports.getCard = async function (cardId) {
    let card = await Card.findById(cardId)
    console.log(`${card} found!`)
}
// How to manage error handling? If card not found?


// PUT 
exports.getCardAndUpdate = async function (cardId, cardTitle, cardBody) {
    let res = await Card.updateOne({ _id: cardId }, {
        $set: {
            title: cardTitle,
            body: cardBody
        }
    })

    console.log(res)
}

