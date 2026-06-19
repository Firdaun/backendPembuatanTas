import express from 'express'
import { bagTypeController } from '../controllers/bagType.controller.js'
import { workLogController } from '../controllers/workLog.controller.js'

const router = express.Router()

router.post('/bag-types', bagTypeController.crtlCreateBagType)
router.get('/bag-types', bagTypeController.crtlBagTypeList)

router.post('/work-logs', workLogController.crtlCreateWorkLog)
router.get('/work-logs', workLogController.crtlWorkLogList)

export { router }