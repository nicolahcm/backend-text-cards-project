const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { Category } = require('./category')

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
    },


    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: Category }]

})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        // delete returnedObject._id
        delete returnedObject.__v
        // the passwordHash should not be revealed
        delete returnedObject.passwordHash
    }
})



const User = mongoose.model('Users', userSchema)


module.exports = { User: User }