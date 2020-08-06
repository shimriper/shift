const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String
    },
    isDisabeld: {
        type: Boolean
    }
});
userSchema.plugin(uniqueValidator, {
    message: 'Email already in use.'
});

module.exports = mongoose.model('User', userSchema);