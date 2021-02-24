const mongoose = require('mongoose')
const { Card } = require('./card.js')
const { User } = require("./user.js")

let categorySchema = new mongoose.Schema({
    title: String,
    Created_date: {
        type: Date,
        default: Date.now
    },
    cards: [{ type: mongoose.Schema.Types.ObjectId, ref: Card }],

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    }
})


let Category = mongoose.model('categories', categorySchema)

module.exports = { Category: Category }