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
//Passport Init
const passport = require('passport');
const initializePass = require('./pass-config')
initializePass(passport, 
    email => user.findOne({email: email}),
    id => user.findOne({id: id})
);
//Database Init
const mongoose = require('mongoose');
const User =  require('./models/user');
const uri = "mongodb+srv://lucasabr:topsecretpassword123@lucas-database.ckz0z.mongodb.net/website-test?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => app.listen(PORT))
    .catch((err) => console.log(err))



app.set('view-engine', 'ejs');
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

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

app.post('/register', async (req, res) => {
    try{
        const hashedPassword = await bcrypt.hash('req.body.password', 10)
        const user = new User({
            name: 'req.body.name',
            email: 'req.body.email',
            password: 'hashedPassword'
        });
        user.save()
            .then((result) => res.redirect('/login'))
            .catch((err) => console.log(err))
    } catch (e){
        console.log(e);
        res.redirect('/register')
    }  
})
