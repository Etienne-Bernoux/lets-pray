import express from 'express'
import { getOneSchoolBoy } from '../domain/schoolBoy/getOneSchoolBoy'

const router = express.Router()
router.get('/', async function (req, res, next) {
  const schoolBoys = await getOneSchoolBoy()
  res.send(JSON.stringify(schoolBoys))
})
export default router
