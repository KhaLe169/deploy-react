const mongoose = require("mongoose");
const Message = require("./message");

const threadSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    content: [Message.schema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

threadSchema.methods.addMessage = function (message) {
    this.content.push(message);
    return this.save();
};

module.exports = mongoose.model('Thread', threadSchema);