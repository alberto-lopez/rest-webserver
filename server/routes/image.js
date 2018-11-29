const express = require('express');
const fs = require('fs');
const path = require('path');

let {verifyTokenImg} = require('../middlewares/auth');

let app = express();

app.get('/image/:type/:img',verifyTokenImg, (req, res) => {

    let type = req.params.type;
    let img = req.params.img;

    let pathImg = path.resolve(__dirname, `../../uploads/${type}/${img}`);

    if(fs.existsSync(pathImg)){
        res.sendFile(path.resolve(pathImg));
    }else{
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(path.resolve(noImagePath));
    }
});

module.exports = app;