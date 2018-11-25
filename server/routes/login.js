const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const app = express();

app.post('/login', (req, res) => {
    let body= req.body;

    User.findOne({'email': body.email}, (err, userDB)=>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!userDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(User) or password is incorrect'
                }
            });
        }

        if(!bcrypt.compareSync(body.password, userDB.password)){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User or (password) is incorrect'
                }
            });
        }

        let token = jwt.sign({
            user: userDB,
        }, process.env.SEED_TOKEN, { expiresIn: process.env.EXPIRE_TOKEN });

        return res.json({
            ok: true,
            user: userDB,
            token
        })

    });
});

module.exports = app;