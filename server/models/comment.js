const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    userName: {
        type: String,
        required: true,
    },
    userImg: {
        data: Buffer
    },
    commentText: {
        type: String,
        required: true
    },
    postedOn: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
    },
    rating: {
        type: Number,
    },
    replyMessage: [{
        commentId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        replyText: {
            type: String,
            required: true
        },
        vendorBusinessName: {
            type: String,
        },
        vendorImg: {
            data: Buffer
        },
        userName: {
            type: String,
            required: true,
        },
        userImg: {
            data: Buffer
        },
        postedOn: {
            type: Date,
            default: Date.now
        },
    }],
    likes: {
        type: Number,
        default: 0,
    },
    like: [{
        likeBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            default: null
        }
    }]
});

commentSchema.methods.likeComment = function (userId) {
    const index = this.like.findIndex(like => like.likeBy.toString() === userId.toString());

    // If the user hasn't liked the comment yet, add their like and increment the likes count
    if (index === -1) {
        this.like.push({ likeBy: userId });
        this.likes += 1;
    } else {
        // If the user has already liked the comment, remove their like and decrement the likes count
        this.like.splice(index, 1);
        this.likes -= 1;
    }

    return this.save();
};

module.exports = mongoose.model('Comment', commentSchema);