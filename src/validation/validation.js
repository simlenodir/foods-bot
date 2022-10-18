import Joi from "joi"

export const foodsValidation = Joi.object().keys({
    kitchName: Joi.string().required().max(15).min(3),
    name: Joi.string().required().max(15).min(2),
    description: Joi.string().required().max(250).min(2),
    price: Joi.number().required(),
    url: Joi.string().required() 
})