const mongoose = require('mongoose')
const { Card } = require('./card.js')

let categorySchema = new mongoose.Schema({
    title: String,
    Created_date: {
        type: Date,
        default: Date.now
    },
    cards: [{ type: mongoose.Schema.Types.ObjectId, ref: Card }]
})


let Category = mongoose.model('categories', categorySchema)

module.exports = { Category: Category }