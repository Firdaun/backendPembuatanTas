import { workLogService } from '../services/workLog.service.js'

const crtlCreateWorkLog = async (req, res, next) => {
    try {
        const body = req.body
        const result = await workLogService.svcCreateWorkLog(body)
        res.status(201).json({
            message: "Work log added successfully",
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const crtlWorkLogList = async (_req, res, next) => {
    try {
        const result = await workLogService.svcGetWorkLogList()
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const crtlCompleteWorkLog = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)

        const result = await workLogService.svcCompleteWorkLog(id)

        res.status(200).json({
            message: "Work log completed successfully",
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const crtlGetTotalIncome = async (req, res, next) => {
    try {
        // Pass the query object (which contains startDate and endDate)
        const result = await workLogService.svcGetTotalIncome(req.query)

        res.status(200).json({
            data: {
                startDate: req.query.startDate,
                endDate: req.query.endDate,
                totalIncome: result
            }
        })
    } catch (e) {
        next(e)
    }
}

export const workLogController = {
    crtlCreateWorkLog,
    crtlWorkLogList,
    crtlCompleteWorkLog,
    crtlGetTotalIncome
}