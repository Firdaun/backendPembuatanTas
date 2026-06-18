import express from 'express'
import { bagTypeController } from '../controllers/bagType.controller.js'

const router = express.Router()

router.post('/bag-types', bagTypeController.crtlCreateBagType)
router.get('/bag-types', bagTypeController.crtlBagTypeList)

export { router }