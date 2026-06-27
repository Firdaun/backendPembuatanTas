import { Joi } from "./customJoi.validation.js"

const createWorkLogValidation = Joi.object({
    bagTypeId: Joi.number().required().positive(),
    quantityDozens: Joi.number().required().positive().max(10),
    startTime: Joi.date().optional()
})

const getWorkLogValidation = Joi.number().required().positive()

const updateWorkLogValidation = Joi.object({
    bagTypeId: Joi.number().positive().optional(),
    quantityDozens: Joi.number().positive().max(10).optional()
}).min(1)

const getIncomeValidation = Joi.object({
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().required()
})

export { createWorkLogValidation, getWorkLogValidation, updateWorkLogValidation, getIncomeValidation }