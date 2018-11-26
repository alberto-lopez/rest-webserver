require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//enable public views
app.use( express.static( path.resolve(__dirname , "../public")));

//global routes
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, (err, res) => {
    if(err) throw err;

    console.log('Database running')
});

app.listen(process.env.PORT, () => {
    console.log('Listening on port', process.env.PORT);
});