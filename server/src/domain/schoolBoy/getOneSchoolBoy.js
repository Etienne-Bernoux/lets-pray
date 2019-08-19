import { getAllSchoolBoy } from '../../infrastructure/services/airtable/schoolBoyAirtable'

async function getOneSchoolBoy () {
  const schoolBoys = await getAllSchoolBoy()
  return schoolBoys.shift()
}

export { getOneSchoolBoy }
