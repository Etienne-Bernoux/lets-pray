import Airtable from 'airtable'
import NodeCache from 'node-cache'
const cache = new NodeCache({ stdTTL: 5 })

const SCHOOL_BOY = 'schoolBoy'

async function getAllSchoolBoy () {
  let schoolBoys = await cache.get(SCHOOL_BOY)
  if (schoolBoys) {
    return schoolBoys
  }
  const base = new Airtable().base(process.env.AIRTABLE_BASE)
  const schoolBoysTable = base('SchoolBoy')

  const records = await schoolBoysTable.select({
    view: 'Grid view'
  }).all()

  schoolBoys = records.map(record => {
    return {
      id: record.id,
      name: record.get('Prenom')
    }
  })
  cache.set(SCHOOL_BOY, schoolBoys)
  return schoolBoys
}

export { getAllSchoolBoy }
