export const getLocation = (bot, chatId, userLocation) => {
    const locat = `${userLocation.components.country} ${userLocation.components.city} ${userLocation.components.residential} `
    return bot.sendMessage(chatId, `manzilingiz ${locat} to'g'rimi`, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "Ha",
                        callback_data: `${locat}::yeah`
                    },
                    {
                        text: "Yo'q",
                        callback_data: `no`
                    }
                ]
            ],
            one_time_keyboard: true
        }
    })
}