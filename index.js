//Basic App Init
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const bcrypt = require('bcrypt');
//Database Init
const mongoose = require('mongoose');
const User =  require('./models/user');
const uri = "mongodb+srv://lucasabr:topsecretpassword123@lucas-database.ckz0z.mongodb.net/website-test?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => app.listen(PORT))
    .catch((err) => console.log(err))



app.set('view-engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.post('/login', (req, res) => {
    
})

app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.post('/register', async (req, res) => {
    try{
        const hashedPassword = await bcrypt.hash('req.body.password', 10)
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        user.save()
            .then((result) => res.redirect('/login'))
            .catch((err) => console.log(err))
    } catch {
        console.log('error');
        res.redirect('/register')
    }
    

    
})
