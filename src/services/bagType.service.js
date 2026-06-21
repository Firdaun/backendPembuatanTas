import { prismaClient } from "../application/database.js"
import { bagTypeValidation } from "../validation/bagType.Validation.js"
import { validate } from "../validation/validation.js"

const svcCreateBagType = async (req) => {
    const data = validate(bagTypeValidation, req)
    return await prismaClient.bagType.create({
        data: data,
        select: {
            startTime: true
        }
    })
}

const svcGetBagTypeList = async () => {
    return await prismaClient.bagType.findMany()
}

export const bagTypeService = {
    svcCreateBagType,
    svcGetBagTypeList
}
