const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        lowercase: true,
        enum: ["case", 'capsule', 'weapon', 'patch', 'agent', 'graffiti', 'sticker']
    },
    url: {
        type: String,
        required: true
    },
    currentPrice: {
        //TODO parse to Int
        type: String
    }
    
})

const Ticket = mongoose.model('ticket', ticketSchema)

module.exports = Ticket