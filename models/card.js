const mongoose = require('mongoose')

let cardSchema = new mongoose.Schema({
    title: String,
    body: String,
    Created_date: {
        type: Date,
        default: Date.now
    },
})

let Card = mongoose.model('cards', cardSchema);

module.exports = { Card: Card }