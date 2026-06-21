import { prismaClient } from "../application/database.js"
import { ResponseError } from "../error/response.error.js"
import { validate } from "../validation/validation.js"
import { createWorkLogValidation, getWorkLogValidation } from "../validation/workLog.validation.js"

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
            ...data,
            pricePerDozen: bagType.pricePerDozen,
            estimatedPay: estimatedPay,
            status: "PENDING"
        },
        select: {
            id: true,
            startTime: true
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
            startTime: 'desc'
        }
    })
}

const svcCompleteWorkLog = async (workLogId) => {
    const id = validate(getWorkLogValidation, workLogId)

    const existingLog = await prismaClient.workLog.findUnique({
        where: {
            id: id
        }
    })

    if (!existingLog) {
        throw new ResponseError(404, "Work log not found")
    }

    if (existingLog.status === 'SETOR') {
        throw new ResponseError(400, "Work log is already completed")
    }

    const endTime = new Date()
    const startTime = existingLog.startTime

    const durationMs = endTime.getTime() - startTime.getTime()
    const durationMinutes = Math.floor(durationMs / 60000)

    return await prismaClient.workLog.update({
        where: {
            id: id
        },
        data: {
            status: "SETOR",
            endTime: endTime,
            durationMinutes: durationMinutes
        }
    })
}

export const workLogService = {
    svcCreateWorkLog,
    svcGetWorkLogList,
    svcCompleteWorkLog
}