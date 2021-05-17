const express = require('express');
const mongoose = require('mongoose');
const uri = "mongodb+srv://lucasabr:topsecretpassword123@lucas-database.ckz0z.mongodb.net/website-test?retryWrites=true&w=majority";


const PORT = process.env.PORT || 5000;
const app = express();

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
    
})
