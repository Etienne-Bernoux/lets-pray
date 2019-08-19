import Airtable from 'airtable'

import NodeCache from 'node-cache'
const cache = new NodeCache({ stdTTL: 5 })

const PRAYER = 'Prayer'

async function getAllPrayers () {
  let prayers = await cache.get(PRAYER)
  if (prayers) {
    return prayers
  }

  let records = []
  try {
    const base = new Airtable().base(process.env.AIRTABLE_BASE)
    const prayerTable = base(PRAYER)
    records = await prayerTable.select({
      view: 'Grid view'
    }).all()
  } catch (err) {
    console.log(err)
  }

  prayers = records.map(record => {
    return {
      id: record.id,
      userId: record.get('userId'),
      schoolBoy: record.get('schoolBoy')
    }
  })
  cache.set(PRAYER, prayers)
  return prayers
}

async function findPrayerByUser (userId) {
  const prayers = await getAllPrayers()
  return prayers.filter(prayer => prayer.userId === userId).shift
}

async function createPrayer (userId, schoolBoyId) {
  const prayer = await findPrayerByUser()
  if (prayer) {
    if (prayer.schoolBoy && prayer.schoolBoy.contain(schoolBoyId)) {
      throw new Error('This prayer already exist')
    } else {
      const schoolBoyIds = [...prayer.schoolBoy, schoolBoyId]
      await updatePrayerWithSchoolBoys(prayer.id, schoolBoyIds)
    }
  }
  const base = new Airtable().base(process.env.AIRTABLE_BASE)
  const PrayerTable = base(PRAYER)

  await PrayerTable.create({
    userId: userId,
    schoolBoy: [
      schoolBoyId
    ]
  }, (err, prayer) => {
    if (err) {
      throw new Error(err)
    }
    return prayer
  })
}

async function updatePrayerWithSchoolBoys (prayerId, schoolBoyIds) {
  const base = new Airtable().base(process.env.AIRTABLE_BASE)
  const prayerTable = base(PRAYER)
  await prayerTable.update(prayerId, {
    SchoolBoy: schoolBoyIds
  }, (err, prayer) => {
    if (err) {
      throw new Error(err)
    }
    return prayer
  })
}

export { createPrayer }
