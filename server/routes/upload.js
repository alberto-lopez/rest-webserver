const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const User = require('../models/user');
const Product = require('../models/product');

const fs = require('fs');
const path = require('path');

app.use(fileUpload());

app.put('/upload/:type/:id', (req, res) => {

    let type = req.params.type;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'Any file was found'
                }
            })
    }

    //validate type
    let validTypes = ['product', 'user'];
    if (validTypes.indexOf(type) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'The allowed types are ' + validTypes.join(', ')
                }
            })
    }

    let image = req.files.image;
    let splittedName = image.name.split('.');
    let extension = splittedName[splittedName.length - 1];

    // Allowed extensions
    let validExtensions = ['png', 'jpg', 'gif', 'jpeg'];

    if (validExtensions.indexOf(extension) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'The allowed filetype are ' + validExtensions.join(', ')
                }
            })
    }

    //changing filename
    let filename = `${id}-${new Date().getMilliseconds()}.${extension}`;

    image.mv(`uploads/${type}/${filename}`, (err) => {
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                })
        }

        if(type === 'user'){
            userImage(id, res, filename);
        }else{
            productImage(id, res, filename);
        }


    })

});

function userImage(id, res, filename) {

    User.findById(id, (err, userDB) =>{
        if(err){
            unlinkFile('user', filename);
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!userDB){
            unlinkFile('user', filename);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User doesn\'t exist'
                }
            })
        }

        unlinkFile('user', userDB.img);

        userDB.img = filename;
        userDB.save((err, savedUser) =>{
            res.json({
                ok: true,
                user: savedUser,
                img: filename
            })
        })

    })

}

function productImage(id, res, filename) {
    Product.findById(id, (err, productDB) =>{
        if(err){
            unlinkFile('product', filename);
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!productDB){
            unlinkFile('product', filename);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'The product doesn\'t exist'
                }
            })
        }

        unlinkFile('product', productDB.img);

        productDB.img = filename;
        productDB.save((err, savedProduct) =>{
            res.json({
                ok: true,
                product: savedProduct,
                img: filename
            })
        })

    })

}

function unlinkFile(type, img) {
    let pathImg = path.resolve( __dirname, `../../uploads/${type}/${img}`);
    if(fs.existsSync(pathImg)){
        fs.unlinkSync(pathImg);
    }
}

module.exports = app;