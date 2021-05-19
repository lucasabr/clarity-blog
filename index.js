if (process.env.NODE_ENV !== 'production') { 
    require('dotenv').config()
}

//Basic App Init
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const bcrypt = require('bcrypt');
const flash = require('express-flash')
const session = require('express-session')
var bodyParser = require('body-parser')
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('source'));
//Database Init
const mongoose = require('mongoose');
const User =  require('./models/user');
const uri = "mongodb+srv://lucasabr:topsecretpassword123@lucas-database.ckz0z.mongodb.net/website-test?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => app.listen(PORT))
    .catch((err) => console.log(err))



//Passport Init
const passport = require('passport');
const initializePass = require('./passport-config')
initializePass(passport);
 
app.set('view-engine', 'ejs');
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize())
app.use(passport.session())
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })



app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
})) 

app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.post('/register', urlencodedParser, async (req, res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        user.save()
            .then((result) => res.redirect('/login'))
            .catch((err) => console.log(err))
    } catch (e){
        console.log(e);
        res.redirect('/register')
    }  
})
