const express = require("express")
const app = express()
const path = require("path")
const mongoose = require('mongoose');
const Ticket = require("./models/ticket")
//const exp = require("constants");
const methodOverride = require('method-override')
const scrapePrice = require('./scraper');
const { db } = require("./models/ticket");
require('events').EventEmitter.defaultMaxListeners = 30;

//scrapePrice("https://csgostash.com/stickers/capsule/352/Antwerp-2022-Challengers-Autograph-Capsule")

mongoose.connect('mongodb://localhost:27017/invstTickets')
    .then(() => {
        console.log("mongo connected")
    })
    .catch(err => {
        console.log("mongo ERROR")
        console.error(err)
    })

const categories = ["case", 'capsule', 'weapon', 'patch', 'agent', 'graffiti', 'sticker']
let total = {
    totalInvestment: 0,
    totalValue: 0,
}

const getTotal = async function () {
    total.totalInvestment = 0;
    total.totalValue = 0;

    let tickets = await Ticket.find({})
    for (let ticket of tickets) {
        total.totalInvestment += ticket.price * ticket.amount
        total.totalValue += ticket.currentPrice * ticket.amount
    }
    console.log(total)
}

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.listen(3000, () => {
    console.log("app listening..")
})

app.get("/", async (req, res) => {
    let tickets = await Ticket.find({})
    for (let ticket of tickets) {
        await scrapePrice(ticket.url, ticket)
    }
    await getTotal()

    res.render("index", { tickets, categories, total })
})

app.get("/create", (req, res) => {
    res.render("create", { categories })
})

app.get("/edit/:id", async (req, res) => {
    const { id } = req.params
    const ticket = await Ticket.findById(id)
    res.render('edit', { ticket, categories })
})

app.put("/:id", async (req, res) => {
    const { id } = req.params
    const ticket = await Ticket.findByIdAndUpdate(id, req.body, { runValidators: true, new: true })
    res.redirect(`show/${ticket._id}`)
})

app.delete("/:id", async (req, res) => {
    const { id } = req.params
    const ticket = await Ticket.findByIdAndDelete(id)
    res.redirect("/");
})

app.get("/show/:id", async (req, res) => {
    const { id } = req.params
    const ticket = await Ticket.findById(id)
    //ticket.currentPrice = await scrapePrice(ticket.url)
    console.log(ticket)
    res.render(`show`, { ticket })
})

app.post("/", async (req, res) => {
    console.log(req.body)
    const newTicket = new Ticket(req.body)
    await newTicket.save()
    res.redirect("/")
})