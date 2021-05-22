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
app.use(methodOverride('_method'))




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

app.post('/register', checkNotAuthenticated, (req, res) => {
    //looks for a user with the email
    User.findOne({email: req.body.email})
        .then(user => {
            if(!user){
                //if there is no user with the email, looks for a user with the same username
                User.findOne({name: req.body.name})
                    .then(async user2 => {
                        if(!user2){
                            //if there is no user with the username, saves to database
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
                        } else{
                            res.render("register.ejs", {message: "ERROR! There already exists an account with this username"})
                        }
                        })
                        .catch(e => console.log(e))
                
        } else{
            res.render("register.ejs", {message: "ERROR! There already exists an account with this email"})
        }
    })
        .catch( e => console.log(e))
        
      
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
