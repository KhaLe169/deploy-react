const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },

    product_name: {
        type: String,
        require: true,
    },

    category: {
        type: String,
        require: true,
    },

    price: {
        type: Number,
        require: true,
    },

    description: {
        type: String,
        require: true,
    },

    stock: {
        type: Number,
        require: true,
    },

    image_link: {
        type: String,
    },

    img: {
        data: Buffer,
        contentType: String,
    },

    ratings: {
        type: Number,
        require: true,
    },

    no_of_ratings: {
        type: Number,
        require: true,
    },

});

module.exports = mongoose.model('Product', productSchema)