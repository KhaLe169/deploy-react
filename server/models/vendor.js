const mongoose = require('mongoose')

const vendorSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
    },

    password: {
        type: String,
        require: true,
    },

    businessName: {
        type: String,
        require: true,
    },

    address: {
        type: String,
        require: true,
    },

    phoneNumber: {
        type: String,
    },

    img: {
        data: Buffer,
    },

    coverPhoto: {
        type: String,
    },

    bigBanner: {
        type: String,
    },

    smallBanner1: {
        type: String,
    },

    smallBanner2: {
        type: String,
    },

    verify: {
        type: Boolean,
        default: false,
    },

    role: {
        type: String,
        require: true,
        default: "Vendor",
    },
    
    banEndDate: {
        type: Date,
    },

    banStartDate: {
        type: Date,
    },
});

module.exports = mongoose.model('Vendor', vendorSchema)