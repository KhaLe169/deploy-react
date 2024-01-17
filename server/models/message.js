const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        enum: ['User', 'Vendor'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    userSeen: {
        type: Boolean,
        default: false
    },
    vendorSeen: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Message', messageSchema);