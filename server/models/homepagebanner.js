const mongoose = require('mongoose');

const homepageSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    img: [
        {type: String}
    ]
})

module.exports = mongoose.model('HomepageBanner', homepageSchema)