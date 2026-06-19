import { prismaClient } from "../application/database.js"
import { ResponseError } from "../error/response.error.js"
import { validate } from "../validation/validation.js"
import { createWorkLogValidation } from "../validation/workLog.validation.js"

const svcCreateWorkLog = async (req) => {
    const data = validate(createWorkLogValidation, req)
    const bagType = await prismaClient.bagType.findUnique({
        where: {
            id: data.bagTypeId
        }
    })

    if (!bagType) {
        throw new ResponseError(404, "Bag type not found")
    }

    const estimatedPay = data.quantityDozens * bagType.pricePerDozen

    return await prismaClient.workLog.create({
        data: {
            bagTypeId: data.bagTypeId,
            quantityDozens: data.quantityDozens,
            startTime: data.startTime || new Date(),
            pricePerDozen: bagType.pricePerDozen,
            estimatedPay: estimatedPay,
            status: "PENDING"
        },
        select: {
            id: true,
            createdAt: true
        }
    })
}

const svcGetWorkLogList = async () => {
    return await prismaClient.workLog.findMany({
        include: {
            bagType: {
                select: {
                    name: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
}

export const workLogService = {
    svcCreateWorkLog,
    svcGetWorkLogList
}