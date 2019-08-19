import express from 'express'
import prayForOneSchoolBoy from '../useCase/prayForOneSchoolBoy'
import getUserId from '../infrastructure/services/auth0/auth0AuthenticationServices'

const router = express.Router()

router.get('/', function (req, res, next) {
  res.send(req.token)
})

router.get('/schoolBoy', async function (req, res, next) {
  const userId = await getUserId(req.token)
  const schoolBoy = await prayForOneSchoolBoy(userId)
  res.send(schoolBoy)
})

export default router
