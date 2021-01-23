const express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    //const { Card } = require('./models/card.js')
    { Category } = require('./models/category.js'),
    cardController = require('./controllers/cardController.js'),
    categoryController = require('./controllers/categoryController.js'),
    bodyParser = require('body-parser')


mongoose.connect('mongodb://localhost/textCardArr', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("connection estabilished!"))
    .catch((err) => console.error(err.message));



// ?????????????????????????????????????????????????
// What's left to do?
// a) when deleting card, also delete the reference from category. <--- Hard, maybe useless.
// b) error handling (less important), for example when nothing has been found!


//// 1)
/// Some experiments with categoryController. They all work!

//categoryController.createCategory("Nuvo")
//categoryController.getCategories()
//categoryController.getCategoriesAndPopulate()
//categoryController.getOneCategory("600b391bc65555a5e6171e65")
//categoryController.deleteOneCategory("600b391bc65555a5e6171e65")
//categoryController.getOneCategoryAndUpdateTitle1("600b13fe08c1f17dcf4c1717", "Testing")
//categoryController.getOneCategoryAndUpdateTitle2("600b13fe08c1f17dcf4c1717", "Not fac.!!")


///// 2) 
/// Some experiments with cardController. They all work!

//cardController.createAndAddCardToCategory("600b13fe08c1f17dcf4c1717", "G", "F")
//cardController.getOneCard("600b1f8d2aac228b6cc4a63b")
//cardController.deleteCard("600b1f8d2aac228b6cc4a63b")
//cardController.getCard("600b3636852d96a0363efca3")
//cardController.getCardAndUpdate("600b3636852d96a0363efca3", "E", "D")


//-----------------------------------------------

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



/// When going to respond will say that it allows! 
app.use('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Accept, Origin, Content-Type, access_token');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});







let cardRoutes = require('./routes/cardRoutes.js');
cardRoutes(app)

let categoryRoutes = require('./routes/categoryRoutes.js')
categoryRoutes(app)



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`))

