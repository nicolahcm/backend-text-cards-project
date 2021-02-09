const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


// 1) To add the unique username thing!

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 20,
        unique: true,
    },

    name: {
        type: String,
        minlength: 2,
        maxlength: 20,
    },

    passwordHash: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 100,
    },

    maxCards: {
        type: Number,
        default: 100
    },

    createdDate: {
        type: Date,
        default: Date.now
    }
})


userSchema.plugin(uniqueValidator)

const User = mongoose.model('Users', userSchema)


module.exports = User