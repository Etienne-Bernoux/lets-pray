import axios from 'axios'

async function getUserId (token) {
  const config = {
    baseURL: 'https://' + process.env.AUTHO_DOMAIN + '/',
    headers: { Authorization: 'Bearer ' + token }
  }
  try {
    const response = await axios.get('/userinfo', config)
    return response.data.sub
  } catch (e) {
    throw new Error('Authentication error, ' + e)
  }
}

export default getUserId
