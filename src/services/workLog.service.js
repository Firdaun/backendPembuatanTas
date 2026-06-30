import { prismaClient } from "../application/database.js"
import { ResponseError } from "../error/response.error.js"
import { validate } from "../validation/validation.js"
import { createWorkLogValidation, getIncomeValidation, getWorkLogValidation, updateWorkLogValidation } from "../validation/workLog.validation.js"

const svcCreateWorkLog = async (req) => {
    const data = validate(createWorkLogValidation, req)

    const existingPending = await prismaClient.workLog.findFirst({
        where: {
            status: "PENDING"
        }
    })

    if (existingPending) {
        throw new ResponseError(400, "Masih ada log yang PENDING. Selesaikan terlebih dahulu sebelum membuat log baru.")
    }

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

const svcGetTotalIncome = async (query) => {
    const { startDate, endDate } = validate(getIncomeValidation, query)

    const start = new Date(startDate)
    const end = new Date(endDate)

    const result = await prismaClient.workLog.aggregate({
        _sum: {
            estimatedPay: true
        },
        where: {
            status: 'SETOR',
            endTime: {
                gte: start,
                lte: end
            }
        }
    })

    return result._sum.estimatedPay || 0
}

const svcUpdateWorkLog = async (workLogId, req) => {
    const id = validate(getWorkLogValidation, workLogId)
    const data = validate(updateWorkLogValidation, req)

    const existingLog = await prismaClient.workLog.findUnique({
        where: {
            id: id
        }
    })

    if (!existingLog) {
        throw new ResponseError(404, "Work log not found")
    }

    if (existingLog.status !== 'PENDING') {
        throw new ResponseError(400, "Hanya log dengan status PENDING yang bisa diedit")
    }

    const bagTypeId = data.bagTypeId || existingLog.bagTypeId
    const quantityDozens = data.quantityDozens || existingLog.quantityDozens

    const bagType = await prismaClient.bagType.findUnique({
        where: {
            id: bagTypeId
        }
    })

    if (!bagType) {
        throw new ResponseError(404, "Bag type not found")
    }

    const estimatedPay = quantityDozens * bagType.pricePerDozen

    return await prismaClient.workLog.update({
        where: {
            id: id
        },
        data: {
            bagTypeId: bagTypeId,
            quantityDozens: quantityDozens,
            pricePerDozen: bagType.pricePerDozen,
            estimatedPay: estimatedPay
        }
    })
}

export const workLogService = {
    svcCreateWorkLog,
    svcGetWorkLogList,
    svcCompleteWorkLog,
    svcGetTotalIncome,
    svcUpdateWorkLog
}