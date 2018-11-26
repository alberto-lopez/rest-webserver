const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const User = require('../models/user');
const app = express();

app.post('/login', (req, res) => {
    let body = req.body;

    User.findOne({'email': body.email}, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(User) or password is incorrect'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User or (password) is incorrect'
                }
            });
        }

        let token = jwt.sign({
            user: userDB,
        }, process.env.SEED_TOKEN, {expiresIn: process.env.EXPIRE_TOKEN});

        return res.json({
            ok: true,
            user: userDB,
            token
        })

    });
});

// Google config
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();

    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async (req, res) => {

    let token = req.body.idtoken;

    let googlUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                err
            });
        });

    User.findOne({email: googlUser.email}, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (userDB) {
            if (!userDB.google) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "You must user your normal credentials"
                    }
                });
            } else {
                let token = jwt.sign({
                    user: userDB,
                }, process.env.SEED_TOKEN, {expiresIn: process.env.EXPIRE_TOKEN});

                return res.json({
                    ok: true,
                    user: userDB,
                    token
                })
            }
        } else {
            //If user doesn't exist must be created
            let user = new User();

            user.name = googlUser.name;
            user.email = googlUser.email;
            user.img = googlUser.img;
            user.google = true;
            user.password = ':)';

            user.save((err, userDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    user: userDB,
                }, process.env.SEED_TOKEN, {expiresIn: process.env.EXPIRE_TOKEN});

                return res.json({
                    ok: true,
                    user: userDB,
                    token
                })
            })
        }

    });


});

module.exports = app;