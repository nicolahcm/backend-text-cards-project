const mongoose = require('mongoose')
const { Card } = require('./models/card.js')
const { Category } = require('./models/category.js')


mongoose.connect('mongodb://localhost/textCardArr', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("connection estabilished!"))
    .catch((err) => console.error(err.message));



// ?????????????????????????????????????????????????
// What's left to do?
// a) when deleting card, also delete the reference from category. <--- Hard, maybe useless.
// b) error handling (less important), for example when nothing has been found!




// 2) Category handling
/////////////////////////////// 

// 2.1) Categories handling routes.
// POST
async function createCategory(title) {
    let categ = new Category({ title: title })
    categ.save((err, categ) => console.log(`category Saved! id is ${categ.id}`))

    // We have to return the ID!!! Use await! 
}

// GET 1:
async function getCategories() {
    let categories = await Category.find({})
    console.log(categories)
}

// GET 2:
async function getCategoriesAndPopulate() {
    let categories = await Category
        .find()
        .populate("cards", "title body")
    console.log(categories[0])
    // even though the console doesn't populate, it has indeed populated. 
    // It just doesn't show them because of few space in the terminal

    // moreover, if the references to the other objects are existing ,but the referenced objects (cards)
    // have been deleted, then it doesn't show them!
}

//getCategoriesAndPopulate()



// 2.2) Single category handling routes. 
// GET
async function getOneCategory(categoryId) {
    let doc = await Category.findById(categoryId) // doc is the document category with that id.

    console.log(doc)
}

// DELETE 
async function deleteOneCategory(categoryId) {
    Category.findByIdAndDelete({ _id: categoryId }, (err, doc) => { console.log(`${doc} has been deleted`) })
}

// UPDATE category title.
// 1st way of doing it: retrieving, modifying on backend, and saving on db
async function getOneCategoryAndUpdateTitle1(categoryId, titleUpdate) {

    let category = await Category.findById(categoryId)
    category.title = titleUpdate
    category.save().then((res) => console.log(`res updated! ${res}`))
}

// getOneCategoryAndUpdateTitle1("600b13fe08c1f17dcf4c1717", "notFacultative anymore")

// 2nd way of doing it: modifying directly in the db:
async function getOneCategoryAndUpdateTitle2(categoryId, titleUpdate) {

    let result = await Category.updateOne({ _id: categoryId }, {
        $set: {
            title: titleUpdate
        }
    })

    console.log(result)
}

// getOneCategoryAndUpdateTitle2("600b13fe08c1f17dcf4c1717", "Not fac.!!")




///////////// 
// 3) Card handling
////--------------------------------

// 3.1) Cards route handiling
// POST
async function createAndAddCardToCategory(catId, cardTitle, cardBody) {

    // Creating card, saving it and retrieving the _id
    let card = new Card({ title: cardTitle, body: cardBody })
    let savedCard = await card.save()
    const idCard = savedCard.id

    // Getting the category and updating the array of cards.
    const categ = await Category.findOne({ _id: catId })
    categ.cards.push(idCard)
    categ.save().then(res => console.log(`card added`))
}

//createAndAddCardToCategory("6009a2dffa66fe7171e51258", "card#3", "corpooo")

// GET
async function getOneCard(cardId) {
    let card = await Card.findById(cardId)
    console.log(card)
}

//getOneCard("600b18d93c46208317498570")


// 3.2) Card route handling (one single card)
// DELETE
async function deleteCard(cardId) {
    Card.findByIdAndDelete(cardId).then((res) => console.log(`card eliminated! ${res}`))
}

//deleteCard("600b18d93c46208317498570")


// GET
async function getCard(cardId) {
    let card = await Card.findById(cardId)
    console.log(`${card} found!`)
}
// How to manage error handling? If card not found?

//getCard("600b1a5df8e1f384e8f8be59")

// PUT 
async function getCardAndUpdate(cardId, cardTitle, cardBody) {
    let res = await Card.updateOne({ _id: cardId }, {
        $set: {
            title: cardTitle,
            body: cardBody
        }
    })

    console.log(res)
}

//getCardAndUpdate("600b1a5df8e1f384e8f8be59", "HAha", "non ci siamo")






