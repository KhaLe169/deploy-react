const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    name: {
        type: String,
    },
    streetAddress: {
        type: String,
    },
    ward: {
        type: String,
    },
    district: {
        type: String,

    },
    city: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    img: {
        data: Buffer,
    },
    verify: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        require: true,
        default: "User",
    },
    banEndDate: {
        type: Date,
    },
    banStartDate: {
        type: Date,
    },
});

module.exports = mongoose.model('User', userSchema)