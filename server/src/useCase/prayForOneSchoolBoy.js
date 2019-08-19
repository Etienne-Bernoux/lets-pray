import { getOneSchoolBoy } from '../domain/schoolBoy/getOneSchoolBoy'
import { createPrayer } from '../infrastructure/services/airtable/prayerAirtable'

async function prayForOneSchoolBoy (userId) {
  const schoolBoy = await getOneSchoolBoy()
  await createPrayer(userId, schoolBoy.id)
  return schoolBoy
}

export default prayForOneSchoolBoy
