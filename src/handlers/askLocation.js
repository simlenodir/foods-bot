export const askLocation = (bot, chatId, orderName,) => {
    return bot.sendMessage(chatId, "Manzilingizni kiriting", {
        reply_markup: JSON.stringify({
            keyboard: [
                [
                    {
                        text: "Mazilingizni kiriting",
                        request_location: true
                    }
                ]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        })
    })
}