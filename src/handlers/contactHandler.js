export const contactHandler = (bot, chatId) => {
    return bot.sendMessage(chatId, "Raqamingizini kiriting", {
        reply_markup: JSON.stringify({
            keyboard: [
                [
                    {
                        text: "Kontaktingizni kiriting",
                        request_contact: true
                    }
                ]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        })
    })
}