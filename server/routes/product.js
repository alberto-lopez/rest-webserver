const express = require('express');
const _ = require('underscore');
let {verifyToken} = require('../middlewares/auth');

let app = express();
let Product = require('../models/product');


//get products
app.get('/product', verifyToken, (req, res) => {
    let from = req.query.from || 0;
    let limit = req.query.limit || 0;

    Product.find({'available': true})
        .populate('user', 'name email')
        .populate('category', 'name')
        .skip(Number(from))
        .limit(Number(limit))
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Product.countDocuments({'available': true}, (err, count) => {
                res.json({
                    ok: true,
                    count,
                    products
                })
            });
        });
});

//get product
app.get('/product/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    Product.findById(id)
        .populate('user', 'name email')
        .populate('category', 'name')
        .exec((err, product) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (product === null) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: `The product with id ${id} doesn\'t exist`
                    }
                });
            }

            res.json({
                ok: true,
                product
            })

        });
});

//search produc
app.get('/product/search/:criteria', verifyToken, (req, res) => {

    let criteria = req.params.criteria;
    let regex = new RegExp(criteria, 'i');

    Product.find({name: regex})
        .populate('category', 'name')
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                products
            })
        });
});

//post product
app.post('/product', verifyToken, (req, res) => {
    let body = req.body;

    let product = new Product({
        name: body.name,
        description: body.description,
        unitPrice: body.unitPrice,
        category: body.category,
        user: req.user._id
    });

    product.save((err, productDB) => {
        if (err) {
            return res.status(50).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: productDB
        });

    });
});

//put product
app.put('/product/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'description', 'unitPrice', 'available']);

    Product.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, productDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `The product with id ${id} doesn\'t exist`
                }
            });
        }

        res.json({
            ok: true,
            user: productDB
        })
    });
});

//put product
app.delete('/product/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let changeStatus = {'available': false};

    Product.findByIdAndUpdate(id, changeStatus, {new: true}, (err, productDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: productDB,
            message: 'Deleted product'
        })
    });
});

module.exports = app;