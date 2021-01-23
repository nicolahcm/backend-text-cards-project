const card = require('../models/card.js')

module.exports = function (app) {

    const cardController = require('../controllers/cardController.js')

    app.get('/cards', cardController.getAllCards)
    app.post('/cards', cardController.createAndAddCardToCategory)

    app.delete("/cards/:id", cardController.deleteCard)

    app.get("/cards/:id", cardController.getCard)

    app.put("/cards/:id", cardController.getCardAndUpdate)

    // manca l'ultimo post: app.post("/cards?categoryId=....", )

}