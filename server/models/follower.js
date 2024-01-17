const mongoose = require('mongoose')

const followerSchema = new mongoose.Schema({
    vendorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor'
    },
    followers: [{
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }]
})

module.exports = mongoose.model('FollowerList', followerSchema);