import { bagTypeService } from '../services/bagType.service.js'

const crtlCreateBagType = async (req, res, next) => {
    try {
        const body = req.body
        const result = await bagTypeService.svcCreateBagType(body)
        res.status(201).json({
            message: "Data added successfully",
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const crtlBagTypeList = async (_req, res, next) => {
    try {
        const result = await bagTypeService.svcGetBagTypeList()
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
}

export const bagTypeController = {
    crtlCreateBagType,
    crtlBagTypeList
}