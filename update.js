const mongoose = require('mongoose');
const { db, updateMany } = require('./models/ticket');
const Ticket = require('./models/ticket')

mongoose.connect('mongodb://localhost:27017/invstTickets')
    .then(() => {
        console.log("mongo connected")
    })
    .catch(err => {
        console.log("mongo ERROR")
        console.error(err)
    })

db.tickets.updateMany({ }, { $set: {currentPrice: -1 }})