import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { errorHandler } from './middleware/error-handler'
import authRouter from './routes/auth'
import mainRouter from './routes/main'
import prisma from './db/db.config'

dotenv.config()
const app = express()

app.use(
  cors({
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)
app.use(express.json())

app.get('/', (req, res) => {
  res.send('🧠 Paperclip Backend Server is Running at 4000!')
})

process.on('SIGTERM', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

app.use('/auth', authRouter)
app.use('/user', mainRouter)

app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Server is live at http://localhost:${PORT}`)
})

export default app
