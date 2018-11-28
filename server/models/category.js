const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'Name is a mandatory field']
    },
    status: {
        type: Boolean,
        default: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
});

categorySchema.plugin( uniqueValidator, {
    message: '{PATH} is a unique field'
} );

module.exports = mongoose.model('category', categorySchema);

