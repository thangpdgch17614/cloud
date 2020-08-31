var express = require('express')
var app = express();
var fs = require('fs');

var publicDir = require('path').join(__dirname, '/public');
app.use(express.static(publicDir));

const engines = require('consolidate');
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

//localhost:5000
app.get('/', function (req, res) {
    res.render('index');
})
app.get('/register', function (req, res) {
    res.render('register');
})


var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://vanhien:hienvan123@cluster0.7hfpc.mongodb.net/test";


app.post('/doRegister', async (req, res) => {
    let client = await MongoClient.connect(url);
    let inputName = req.body.txtName;
    let inputEmail = req.body.txtEmail;
    let dbo = client.db("AccountDB");
    let data = {
        name: inputName,
        email: inputEmail,
    }
    if (inputName.length < 4) {
        let errorModel = {
            nameError: "Name must be greater than 3 characters!"
            , emailError: "Invalid email"
        };
        res.render('register', { model: errorModel })
    } else {
        await dbo.collection("Account").insertOne(data);
        res.redirect('/allUser');


    }
})
app.get("/allUser", async (req, res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db("AccountDB");
    let result = await dbo.collection("Account").find({}).toArray();
    res.render("allUser", { model: result });
})

app.get('/remove', async (req, res) => {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let client = await MongoClient.connect(url);
    let dbo = client.db("AccountDB");
    await dbo.collection("Account").deleteOne({ _id: ObjectID(id) });
    res.redirect('/');
})
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running in 3000 port");
});