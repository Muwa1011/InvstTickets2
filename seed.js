const mongoose = require('mongoose');
const Ticket = require('./models/ticket')

mongoose.connect('mongodb://localhost:27017/invstTickets')
    .then(() => {
        console.log("mongo connected")
    })
    .catch(err => {
        console.log("mongo ERROR")
        console.error(err)
    })


const p = new Ticket({
    name: "Antwerp Cloud9 Holo", price: 8.91, amount: 1, category: "sticker", url: "https://steamcommunity.com/market/listings/730/Sticker%20%7C%20Cloud9%20%28Holo%29%20%7C%20Antwerp%202022" 
})

p.save().then(p => {
    console.log(p)
}).catch(e => {
    console.log(e)
})

const seedTickets = [{
    name: "Prisma 2",
    price: 0.08,
    amount: 500,
    category: "case",
    url: "https://steamcommunity.com/market/listings/730/Prisma%202%20Case"
},
{
    name: "Antwerp Legends",
    price: 0.25,
    amount: 50,
    category: "capsule",
    url: "https://steamcommunity.com/market/listings/730/Antwerp%202022%20Legends%20Sticker%20Capsule"
},
{
    name: "Antwerp Legends Auto",
    price: 0.25,
    amount: 50,
    category: "capsule",
    url: "https://steamcommunity.com/market/listings/730/Antwerp%202022%20Legends%20Autograph%20Capsule"
}
]

Ticket.insertMany(seedTickets).then(res => {
    console.log(res)
}).catch(e => {
    console.log(e)
})