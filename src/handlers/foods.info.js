export const foodInfo = (bot, chatId, foundFoods, oneFoodInfo) => {
    return bot.sendPhoto(chatId, `${oneFoodInfo.url}`,{
        caption: `
        \n<b>description: ${oneFoodInfo.description}</b>
        <b>narxi: ${oneFoodInfo.price} so'm</b>
        `,
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [
                [
                   {
                    text: "orqaga",
                    callback_data: `no`
                   },
                   {
                    text: "buyurtma berish",
                    callback_data: `${oneFoodInfo.name}::${oneFoodInfo.price}`
                   }
                ]
            ]
        }
    })
}
// foodInfo(bot, chatId, foundFoods, oneFoodInfo )