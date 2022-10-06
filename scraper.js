const puppeteer = require('puppeteer')
const cheerio = require('cheerio')

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

const scrapePrice = async function (url, ticket) {

    (async () => {
        // console.log(ticket.name)
        const browser = await puppeteer.launch()

        const page = await browser.newPage()
        await page.setDefaultNavigationTimeout(0)
        await page.goto(url)

        const pageData = await page.evaluate(() => {
            return {
                html: document.documentElement.innerHTML
            }
        })
        await browser.close()
        const $ = cheerio.load(pageData.html)
        let element = $(".content-header-container-btn > a:nth-child(1)")
        if (ticket.category === "agent" || ticket.category === "sticker"){
            console.log("its a agent or sticker or weapon")
            element = $(".market-button-item > span:nth-child(2)")
        } else if(ticket.category === "weapon"){
            // This query is only for FN weapons
            element = $("#prices > div:nth-child(2) > a:nth-child(1) > span:nth-child(2)")
        }
        const currentPriceNumerically = parseFloat(element.text().replace(",", ".")).toFixed(2)
        await Ticket.updateOne({ _id: ticket.id }, { $set: { currentPrice: currentPriceNumerically } })
    })();

}

module.exports = scrapePrice