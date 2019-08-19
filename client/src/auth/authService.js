import auth0 from 'auth0-js'
import { EventEmitter } from 'events'
import authConfig from '../../auth_config.json'

const webAuth = new auth0.WebAuth({
  domain: authConfig.domain,
  clientID: authConfig.clientId
})

const LOGIN_STORAGE_KEY = 'loggedIn'
const loginEvent = 'loginEvent'

class AuthService extends EventEmitter {
  login (customState) {
    webAuth.authorize({
      responseType: 'token id_token',
      appState: customState,
      redirectUri: `${window.location.origin}/callback`,
      audience: authConfig.audience,
      scope: 'openid profile email'
    })
  }

  logOut () {
    localStorage.removeItem(LOGIN_STORAGE_KEY)

    this.idToken = null
    this.accessToken = null
    this.tokenExpiry = null
    this.profile = null

    webAuth.logout({
      returnTo: `${window.location.origin}`
    })

    this.emit(loginEvent, { loggedIn: false })
  }

  handleAuthentication () {
    return new Promise((resolve, reject) => {
      webAuth.parseHash((err, authResult) => {
        if (err) {
          this.emit(loginEvent, {
            loggedIn: false,
            error: err,
            errorMsg: err.statusText
          })
          reject(err)
        } else {
          this.localLogin(authResult)
          resolve(authResult.idToken)
        }
      })
    })
  }

  isAuthenticated () {
    return (
      Date.now() < this.tokenExpiry &&
            localStorage.getItem(LOGIN_STORAGE_KEY) === 'true'
    )
  }

  isIdTokenValid () {
    return this.idToken && this.tokenExpiry && Date.now() < this.tokenExpiry
  }

  getIdToken () {
    return new Promise((resolve, reject) => {
      if (this.isIdTokenValid()) {
        resolve(this.idToken)
      } else if (this.isAuthenticated()) {
        this.renewTokens().then(authResult => {
          resolve(authResult.idToken)
        }, reject)
      } else {
        resolve()
      }
    })
  }

  localLogin (authResult) {
    this.idToken = authResult.idToken
    this.accessToken = authResult.accessToken
    this.profile = authResult.idTokenPayload

    // Convert the expiry time from seconds to milliseconds,
    // required by the Date constructor
    this.tokenExpiry = new Date(this.profile.exp * 1000)

    localStorage.setItem(LOGIN_STORAGE_KEY, 'true')

    this.emit(loginEvent, {
      loggedIn: true,
      profile: authResult.idTokenPayload,
      state: authResult.appState || {}
    })
  }

  renewTokens () {
    return new Promise((resolve, reject) => {
      if (localStorage.getItem(LOGIN_STORAGE_KEY) !== 'true') {
        return reject(new Error('Not logged in'))
      }

      webAuth.checkSession({}, (err, authResult) => {
        if (err) {
          reject(err)
        } else {
          this.localLogin(authResult)
          resolve(authResult)
        }
      })
    })
  }
}

const service = new AuthService()

service.setMaxListeners(5)

export default service
