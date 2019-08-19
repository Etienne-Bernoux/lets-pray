import Auth0Strategy from 'passport-auth0'

function strategy (options, callback) {
  return new Auth0Strategy(options, callback)
}

export default strategy
