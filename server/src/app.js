// app.js
import express from 'express'
import session from 'express-session'

import path from 'path'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import bearerToken from 'express-bearer-token'
import cors from 'cors'
import helmet from 'helmet'
import logger from 'morgan'
import indexRouter from './routes/index'
import usersRouter from './routes/user'
import prayRouter from './routes/pray'
import dotenv from 'dotenv'

import jwt from 'express-jwt'
import jwks from 'jwks-rsa'

import Airtable from 'airtable'

dotenv.config()

const apiKey = process.env.AIRTABLE_API_KEY
Airtable.configure({ apiKey })

const app = express()

const sessionVariables = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true
}

if (app.get('env') === 'production') {
  sessionVariables.cookie.secure = true // serve secure cookies, requires https
}

Airtable.configure({ apiKey })

app.use(helmet())
app.use(bodyParser.json())
app.use(cors())
app.use(logger('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(bearerToken())
app.use(express.static(path.join(__dirname, '../public')))
app.use(session(sessionVariables))

const authCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://lets-pray.eu.auth0.com/.well-known/jwks.json'
  }),
  audience: 'letsprayapi',
  issuer: 'https://lets-pray.eu.auth0.com/',
  algorithms: ['RS256']
})

app.use('/', indexRouter)
app.use('/user', authCheck, usersRouter)
app.use('/pray', authCheck, prayRouter)
export default app
