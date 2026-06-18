import { Joi } from "./customJoi.validation.js"

const bagTypeValidation = Joi.object({
    name: Joi.string().required().max(100).antiXSS(),
    pricePerDozen: Joi.number().required().min(0).max(100000)
})

export { bagTypeValidation }