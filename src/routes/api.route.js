import express from 'express'
import { bagTypeController } from '../controllers/bagType.controller.js'
import { workLogController } from '../controllers/workLog.controller.js'

const router = express.Router()

router.post('/bag-types', bagTypeController.crtlCreateBagType)
router.get('/bag-types', bagTypeController.crtlBagTypeList)

router.get('/work-logs/income', workLogController.crtlGetTotalIncome)

router.post('/work-logs', workLogController.crtlCreateWorkLog)
router.get('/work-logs', workLogController.crtlWorkLogList)
router.patch('/work-logs/:id/setor', workLogController.crtlCompleteWorkLog)
router.put('/work-logs/:id', workLogController.crtlUpdateWorkLog)

export { router }