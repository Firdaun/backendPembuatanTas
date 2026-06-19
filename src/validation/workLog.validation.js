import { Joi } from "./customJoi.validation.js"

const createWorkLogValidation = Joi.object({
    bagTypeId: Joi.number().required().positive(),
    quantityDozens: Joi.number().required().positive(),
    startTime: Joi.date().optional()
})

const getWorkLogValidation = Joi.number().required().positive()

export { createWorkLogValidation, getWorkLogValidation }