const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')



exports.createUser = async (req, res) => {


    const { username, name, password } = req.body

    // 1) Have to check unique username! ok

    let passwordHash

    // 2) What if no username, name, password are sent? ok
    if (password) {
        passwordHash = await bcrypt.hash(password, 10)
    } else {
        return res.json({ error: "username, name and password required!" })
    }

    const newUser = new User({
        username: username,
        name: name,
        passwordHash: passwordHash
    })



    // 3) This might return an error if we do not have right
    // valid fields such as username, passwords, defined in the model.
    try {
        const savedUser = await newUser.save()

        console.log("savedUser is", savedUser)
        res.json(savedUser)
        // Delete Password From response!
    } catch (e) {
        console.error("error occurred:", e)
        // console.error("error.name is:", e.name)  // is ValidationError

        console.error(e.message) // This specifies the error.

        res.json({ error: "invali fields or missing fields!", specificError: e.message })
    }



    //4)  have to delete the password from the response!
}


exports.validateUser = async (req, res) => {

    const { password, username } = req.body

    // 0) What if no password nor name are sent?
    if (!password || !username) {
        return res.json({ error: "insert username and password!" })
    }

    let uniqueUser
    // 1) What if no one found?
    try {
        [uniqueUser] = await User.find({ username: username }) // destructuring with lists!
    } catch (e) {
        return res.json({ error: "no user found!" })
    }


    const ableToLogin = await bcrypt.compare(password, uniqueUser.passwordHash) // returns true or false.


    if (ableToLogin) {
        const data = { name: uniqueUser.name, id: uniqueUser._id, username: uniqueUser.username }

        const token = jwt.sign(data, "secret")
        console.log(token)

        return res.json({ ableToLogin: ableToLogin, token: token })  // sending true or false to the frontend.}
    } else {
        return res.json({ error: "username and password don't match!" })
    }
}

// It works!
// The first user created is:
// {"name": "test", "password": "another Test2", "username": "nicolahcm"}
// {"name": "test", "password": "hieveryone", "username": "nicolahcm2" }







// let hashed = await bcrypt.hash("hi", 10)
// let comparison = await bcrypt.compare("hi", "$2b$10$yVFndYx2i.rnC0LFuc0FZOr62t1c2h7tdCmZ0cTMPJEcJHbHcrLR.")

