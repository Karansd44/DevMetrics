import { config } from 'dotenv'
config({ path: '.env.local' })

import express from 'express'
import session from 'express-session'
import cors from 'cors'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import authRouter from './routes/auth.js'
import githubRouter from './routes/github.js'
import aiRouter from './routes/ai.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()

app.use(express.json())
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 },
}))

app.use('/auth', authRouter)
app.use('/api/github', githubRouter)
app.use('/api/ai', aiRouter)

if (process.env.NODE_ENV === 'production') {
  const dist = join(__dirname, '../dist')
  app.use(express.static(dist))
  app.get('*', (_req, res) => res.sendFile(join(dist, 'index.html')))
}

app.listen(process.env.PORT, () => {
  console.log(`DevMetrics server running on http://localhost:${process.env.PORT}`)
})
