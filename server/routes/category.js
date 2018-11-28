const express = require('express');
const _ = require('underscore');
const Category = require('../models/category');
let {verifyToken, verifyAdminRole} = require('../middlewares/auth');

let app = express();

// Get all categories
app.get('/category', (req, res) => {
    Category.find({status: true})
        .sort('name')
        .populate('creator', 'name email')
        .exec((err, categories) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Category.countDocuments({}, (err, count) => {
                res.json({
                    ok: true,
                    count,
                    categories
                })
            });

        });
});


// Get one category
app.get('/category/:id', (req, res) => {
    let id = req.params.id;

    Category.findOne({_id: id, 'status': true})
        .exec((err, category) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (category === null) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: `The category with id ${id} doesn\'t exist`
                    }
                });
            }

            res.json({
                ok: true,
                category
            })

        });
});

// Create one category
app.post('/category', verifyToken, async (req, res) => {
    let body = req.body;

    let category = new Category({
        name: body.name,
        creator: req.user._id
    });

    category.save((err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: categoryDB
        });

    });
});

// Update one category
app.put('/category/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'status']);

    Category.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `The category with id ${id} doesn\'t exist`
                }
            });
        }

        res.json({
            ok: true,
            user: categoryDB
        })
    });
});

// Update one category
app.delete('/category/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, categoryDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDeleted) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Category not found'
                }
            });
        }

        res.json({
            ok: true,
            category: categoryDeleted
        })
    });
});


module.exports = app;