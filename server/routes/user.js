const express = require('express');
const User = require('../models/user');
const app = express();

const bcrypt = require('bcrypt');
const _ = require('underscore');

app.get('/user', function (req, res) {

    let from = req.query.from || 0;
    let limit = req.query.limit || 0;
    let where = {'status' : true };

    User.find(where, 'name email role status google img')
        .skip(Number(from))
        .limit(Number(limit))
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.countDocuments(where, (err, count) =>{
                res.json({
                    ok: true,
                    count,
                    users
                })
            });

        });

});

app.post('/user', function (req, res) {
    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });

    });
});

app.put('/user/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

    User.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        })
    });
});


app.delete('/user/:id', function (req, res) {
    let id = req.params.id;

    let changeStatus = {'status': false} ;

    User.findByIdAndUpdate(id, changeStatus, {new: true}, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        })
    });
});

/*app.delete('/user/:id', function (req, res) {
    let id = req.params.id;

    User.findByIdAndRemove(id,(err, userDeleted) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if ( !userDeleted ){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            });
        }

        res.json({
            ok: true,
            user: userDeleted
        })
    });

});*/

module.exports = app;