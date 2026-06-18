import dotenv from 'dotenv'
import { web } from './application/web.js'

dotenv.config()

const PORT = process.env.PORT || 8000

web.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://192.168.1.9:${PORT}`)
})