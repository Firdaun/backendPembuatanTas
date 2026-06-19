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

export const workLogController = {
    crtlCreateWorkLog,
    crtlWorkLogList
}