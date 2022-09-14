import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from '@anshuman-gogate-tickets/common'
import { createChargeRouter } from './routes/new'

const app = express()
app.set('trust proxy', true)

app.use(express.json())
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
)

app.use(currentUser)

app.use(createChargeRouter)

// all => all methods GET, POST, etc
app.all('*', (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
