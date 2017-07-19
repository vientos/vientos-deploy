const credentials = require('./credentials.json')

const ENV = 'staging'

const APP = {
  NAME: 'vientos-app',
  DOMAIN: 'app.coop.example'
}
const SERVICE = {
  NAME: 'vientos-service',
  DOMAIN: 'data.coop.example',
  PORT: 8000
}
const IDP = {
  NAME: 'vientos-idp',
  DOMAIN: 'idp.coop.example',
  PORT: 8100
}

const WEBHOOKS = {
  PORT: 8200
}

function url (domain) {
  return `https://${domain}`
}

function dir (name) {
  return `./${name}`
}

function mongo (name) {
  return `${credentials.mongo}${ENV}${name.replace('vientos', '')}`
}

module.exports = {
  apps: [
    {
      name: 'data',
      script: './vientos-service/src/server.js',
      env: {
        NODE_ENV: ENV,
        // TODO: change to PORT: SERVICE.PORT
        HAPI_PORT: SERVICE.PORT,
        // TODO: change to SERVICE_URL: url(SERVICE_DOMAIN),
        OAUTH_CLIENT_DOMAIN: url(SERVICE.DOMAIN),
        // TODO: change to APP_URL: url(APP_DOMAIN),
        PWA_URL: url(APP.DOMAIN),
        VIENTOS_LANGUAGE: 'en',
        MONGO_URL: mongo(SERVICE.NAME),
        COOKIE_PASSWORD: credentials.cookie.service,
        VIENTOS_IDP_URL: url(IDP.DOMAIN),
        GCM_API_KEY: credentials.google.gcmApiKey,
        VIENTOS_CLIENT_ID: credentials.vientos.clientId,
        VIENTOS_CLIENT_SECRET: credentials.vientos.clientSecret,
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
        PORT: IDP.PORT,
        MONGO_URL: mongo(IDP.NAME),
        COOKIE_PASSWORD: credentials.cookie.idp,
        VIENTOS_IDP_URL: url(IDP.DOMAIN),
        OAUTH_CLIENT_REDIRECT_PATH: url(SERVICE.DOMAIN) + '/auth/vientos',
        VIENTOS_CLIENT_ID: credentials.vientos.clientId,
        VIENTOS_CLIENT_SECRET: credentials.vientos.clientSecret,
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
        PORT: WEBHOOKS.PORT,
        WEBHOOKS_SECRET: credentials.github.webhooksSecret,
        APP_DIR: dir(APP.NAME),
        SERVICE_DIR: dir(SERVICE.NAME),
        IDP_DIR: dir(IDP.NAME)
      }
    }
  ]
}
