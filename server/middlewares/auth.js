const jwt = require('jsonwebtoken')

let verifyToken = (req, res, next) => {
    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalid token'
                }
            });
        }

        req.user = decoded.user;

        next();
    });
};

let verifyAdminRole = (req, res, next) => {
    let user = req.user;
    if (user.role === 'ROLE_ADMIN') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'User not allow to perform this action'
            }
        });
    }
};

let verifyTokenImg = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalid token'
                }
            });
        }

        req.user = decoded.user;
        next();
    });
};

module.exports = {
    verifyToken,
    verifyAdminRole,
    verifyTokenImg
};