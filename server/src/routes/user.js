import express from 'express'
import getUserId from '../infrastructure/services/auth0/auth0AuthenticationServices'

const router = express.Router()

router.get('/', async function (req, res, next) {
  const userId = await getUserId(req.token)
  res.send(userId)
})

export default router
