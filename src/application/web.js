import express from 'express'
import cors from 'cors'
import { router } from '../routes/api.route.js'

export const web = express()

web.use(cors())
web.use(express.json())

web.get('/', (_, res) => {
    res.json({ message: 'API Terkoneksi' })
})

web.use('/api', router)