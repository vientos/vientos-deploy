const credentials = require('./credentials.json')

const ENV = 'staging'

const APP_NAME = 'vientos-app'
const SERVICE_NAME = 'vientos-service'
const IDP_NAME = 'vientos-idp'

const APP_DOMAIN = 'app.coop.example'
const SERVICE_DOMAIN = 'data.coop.example'
const IDP_DOMAIN = 'idp.coop.example'

function url (domain) {
  return `https://${domain}`
}

function dir (name) {
  return `./${name}`
}

module.exports = {
  apps: [
    {
      name: 'data',
      script: './vientos-service/src/server.js',
      env: {
        NODE_ENV: ENV,
        HAPI_PORT: 8000,
        // TODO: change to SERVICE_URL: url(SERVICE_DOMAIN),
        OAUTH_CLIENT_DOMAIN: url(SERVICE_DOMAIN),
        // TODO: change to APP_URL: url(APP_DOMAIN),
        PWA_URL: url(APP_DOMAIN),
        MONGO_URL: credentials.mongo + SERVICE_NAME,
        COOKIE_PASSWORD: credentials.cookie.service,
        VIENTOS_IDP_URL: url(IDP_DOMAIN),
        GCM_API_KEY: credentials.google.gcmApiKey,
        VIENTOS_CLIENT_ID: credentials.vientos.clientId,
        VIENTOS_CIIENT_SECRET: credentials.vientos.clientSecret,
        GOOGLE_CLIENT_ID: credentials.google.clientId,
        GOOGLE_CLIENT_SECRET: credentials.google.clientSecret,
        FACEBOOK_CLIENT_ID: credentials.facebook.clientId,
        FACEBOOK_CLIENT_SECRET: credentials.facebook.clientSecret,
        SENTRY_DSN: credentials.sentry.service
      }
    },
    {
      name: 'idp',
      script: './vientos-idp/src/server.js',
      env: {
        NODE_ENV: ENV,
        PORT: 8100,
        MONGO_URL: credentials.mongo + IDP_NAME,
        COOKIE_PASSWORD: credentials.cookie.idp,
        VIENTOS_IDP_URL: url(IDP_DOMAIN),
        OAUTH_CLIENT_REDIRECT_PATH: url(SERVICE_DOMAIN) + '/auth/vientos',
        VIENTOS_CLIENT_ID: credentials.vientos.clientId,
        VIENTOS_CIIENT_SECRET: credentials.vientos.clientSecret,
        FROM_EMAIL: credentials.vientos.fromEmail,
        MAILJET_APIKEY_PUBLIC: credentials.mailjet.public,
        MAILJET_APIKEY_SECRET: credentials.mailjet.secret,
        SENTRY_DSN: credentials.sentry.idp
      }
    },
    {
      name: 'webhooks',
      script: './vientos-deploy/webhooks.js',
      env: {
        GIT_REF: ENV,
        PORT: 8200,
        WEBHOOKS_SECRET: credentials.github.webhooksSecret,
        APP_DIR: dir(APP_NAME),
        SERVICE_DIR: dir(SERVICE_NAME),
        IDP_DIR: dir(IDP_NAME)
      }
    }
  ]
}
