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
const methodOverride = require('method-override')
const jwt = require("jsonwebtoken");
const emailer = require('./emailer')
const email = new emailer()
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
app.use(methodOverride('_method'))



//Routes and Requests
app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', {name: req.user.name})
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
})) 

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs', {message: "You must register to access many of the sites features"})
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
    User.isMailUnique(req.body.email, function(isUnique) {
        if(!isUnique){
            res.render("register.ejs", {message: "ERROR! There already exists an account with this email"}) 
            unique=false
        }
        else{
            User.isNameUnique(req.body.name, async function(isUnique) {
                if(!isUnique){
                    res.render("register.ejs", {message: "ERROR! There already exists an account with this name"}) 
                    unique=false
                } else{
                    try{
                        const hashedPassword = await bcrypt.hash(req.body.password, 10);
                        User.create(req.body.name, req.body.email, hashedPassword, false)
                        res.render("register.ejs", {message: "Please confirm your account via email before logging in."})
                    } catch (e){
                        console.log(e);
                        res.redirect('/register')
                    }
                }
            })
        }
    })      
})
app.get('/confirmation', (req,res) => {
    res.render("confirm.ejs", {message: ""})
})

app.post('/confirmation', (req,res) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if(!user){
            res.render("confirm.ejs", {message: "No account exists with the provided email"})
        }
        else if(user.confirmed){
            res.render("confirm.ejs", {message: "The following account has already been confirmed"})
        }
        else{
            email.sendEmail(user.email, user.id)
            res.render("confirm.ejs", {message: "Confirmation sent to your email"})
        }
    })
})

app.get('/confirmation/:token', (req,res) => {
    jwt.verify(req.params.token, process.env.EMAIL_SECRET, (err, decoded) =>{
        if(err){
            res.render("confirm.ejs", {message: "This confirmation link has expired. Enter your email below to confirm your account."})
        }
        else {
            if(User.confirmUser(decoded.id)){
                res.redirect('/login')
            } else {
                res.send('error')
            }
            
        }
    })
})
app.delete('/logout', (req,res) => {
    req.logOut()
    res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next()
    res.redirect('./login')
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) return res.redirect('./')
    next()
}



