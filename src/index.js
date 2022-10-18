import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"

import TelegramBot from "node-telegram-bot-api"
import keyboard from "./helpers/keyboards/keyboards.info.js"
import { read, write } from "./utils/FS.js"
import {foodInfo} from "./handlers/foods.info.js"
import {orderNameFun} from "./handlers/ordersName.js"
import { askLocation } from "./handlers/askLocation.js"
import { geo } from "./utils/geoFInder.js"
import { getLocation } from "./handlers/getLocation.js"
import { contactHandler } from "./handlers/contactHandler.js"
import { errorHandleMiddleware } from "./middlewares/errorHandleiddleware.js"
import { foodsValidation } from "./validation/validation.js"
import { ErrorHandler } from "./Error/ErrorHandler.js"
// import {foodsMenu} from "./helpers/keyboards/keyboards.info.js"

const PORT = process.env.PORT || 8080

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true })

const app = express()

app.use(express.json())
app.use(cors())

bot.on('error', console.log)

bot.onText(/\/start/, msg => {
    const chatId = msg.chat.id
    bot.sendMessage(chatId, `${msg.from.first_name} welcome my taste foods' bot`, {
        reply_markup: {
            keyboard: keyboard.menu,
            resize_keyboard: true
        
        }
        
    })
})



bot.on('message', msg => {
    const chatId = msg.chat.id
    const foodName = msg.text
    const foundFoods = read('types.json').filter(e => e.kitchName == msg.text)
    
    if (foundFoods.length) {
        bot.sendMessage(chatId,  `Bizning ${foodName} taomlari`, {
            reply_markup: {
                keyboard: keyboard.foodsMenu(foodName),
                resize_keyboard: true
            }
        })    
    }

    if (foodName == "Back to menu 🔙") {
        bot.sendMessage(chatId,  `Asosiy menu`, {
            reply_markup: {
                keyboard: keyboard.menu,
                resize_keyboard: true
            }
        })    
    }
})

bot.on('message', msg => {
    const chatId = msg.chat.id
    const foodName = msg.text
    const foundFoods = read('types.json').filter(e => e.name == foodName)
    const oneFoodInfo = foundFoods?.find(e => e)
    if (oneFoodInfo) {
      return foodInfo(bot, chatId, foundFoods, oneFoodInfo )
        
    }
})
bot.on("callback_query", async msg => {
    const allFoods = read("types.json")
    const chatId = msg.message.chat.id
    const data = msg.data
    const orderName = data.split("::")[0]
    const orderPrice = data.split("::")[1]
    if (orderName  ) {
        await askLocation(bot, chatId, orderName,)
    }
})

bot.on('location', async msg => {

    const chatId = msg.chat.id
    const {latitude, longitude} = msg.location
    const userLocation = await geo(latitude, longitude)
    if (userLocation) {
        getLocation( bot, chatId, userLocation)
    }
})

bot.on('callback_query',async location => {

    
    const chatId = location.message.chat.id
    const userGetLocation = location?.data.split('::')[0]

    const userStatus = location?.data.split('::')[1]

    if (userStatus == 'yeah') {

        const userContact = await contactHandler(bot, chatId) 

        bot.onReplyToMessage(userContact.chat.id, userContact.message_id, async msg =>{
            
            const userName = await bot.sendMessage(msg.chat.id, "Ismingizni yozing",{
                reply_markup: {
                    force_reply: true
                }
            })

            bot.onReplyToMessage(userName.chat.id, userName.message_id, async name => {
                const allUsers = read('users.json')

                allUsers.push({
                    phone: msg.contact.phone_number,
                    name: name.text,
                    location: userGetLocation
                })

                const newUser = write("users.json", allUsers)

                if (newUser) {
                    bot.sendMessage(name.chat.id, `${name.text} buyurtmanigiz qabul qilindi`)
                }
            })
        })


    }
   
})

// from here I started backend logic codes

app.use(errorHandleMiddleware)

app.get("/foods", (_, res) => {
    const allFoods = read("types.json")
    res.json(allFoods)
})

app.get("/users", (_, res ) => {
    const allUsers = read("users.json")

    res.json(allUsers)
})

app.post("/newFood", async (req, res) => {
    const {error, value} = foodsValidation.validate(req.body)
    const {kitchName, name, description, price, url} = value

    const allFoods =read("types.json")
    allFoods.push({kitchName, name, description, price, url})

const newFood = await write("types.json", allFoods)
.catch(err => next(new ErrorHandler(error.message, 400)))

if (newFood) {
    res.json({
        message: "new food created"
    })
}
})

app.all("/*", (_, res) => res.sendStatus(404))

app.listen(8080, () => {
    console.log("http://localhost:" + PORT);
})

