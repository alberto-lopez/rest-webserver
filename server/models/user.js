const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
    values: ['ROLE_ADMIN', 'ROLE_USER'],
    message: '{VALUE} is not a valid role'
}

let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is a mandatory field']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Emais is a mandatory field']
    },
    password: {
        type: String,
        required: [true, 'Password is a mandatory field']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        default: 'ROLE_USER',
        enum: validRoles
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

});

userSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
};

userSchema.plugin( uniqueValidator, {
    message: '{PATH} is a unique field'
} );

module.exports = mongoose.model('user', userSchema);

