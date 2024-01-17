const mongoose = require('mongoose')

const shipperSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
    },

    password: {
        type: String,
        require: true,
    },

    address: {
        type: String,
        require: true,
    },

    name: {
        type: String,
        require: true,
    },

    phoneNumber: {
        type: String,
    },

    distributionHub: {
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
        default: "Shipper",
    },
    banEndDate: {
        type: Date,
    },
    banStartDate: {
        type: Date,
    },
});

module.exports = mongoose.model('Shipper', shipperSchema)