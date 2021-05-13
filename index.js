const express = require('/express');

const app = express();

app.set('view-engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index.ejs')
})
const PORT = process.env.PORT || 5000;
app.listen(PORT);