const fs = require('fs')
const execFile = require('child_process').execFile

const config = {
  path: '/callback',
  port: process.env.PORT,
  secret: process.env.WEBHOOKS_SECRET
}
if (process.env.TLS_KEY_PATH && process.env.TLS_CERT_PATH) {
  config.https = {
    key: fs.readFileSync(process.env.TLS_KEY_PATH),
    cert: fs.readFileSync(process.env.TLS_CERT_PATH)
  }
}

const gh = require('githubhook')(config)
const GIT_REF = process.env.GIT_REF
const SCRIPTS_PATH = process.env.SCRIPTS_PATH

// Increase maxBuffer from 200*1024 to 1024*1024
const execOptions = {
  maxBuffer: 1024 * 1024 // 1mb
}

gh.listen()

gh.on('push:vientos-app:' + GIT_REF, (data) => {
  console.log('APP')
  execFile(`${SCRIPTS_PATH}/update-app.sh`, execOptions, (err, stdout, stderr) => {
    if (err) console.log(err)
    if (stderr) console.log(stderr)
    console.log(stdout)
  })
})

gh.on('push:vientos-service:' + GIT_REF, (data) => {
  console.log('SERVICE')
  execFile(`${SCRIPTS_PATH}/update-service.sh`, execOptions, (err, stdout, stderr) => {
    if (err) console.log(err)
    if (stderr) console.log(stderr)
    console.log(stdout)
  })
})

gh.on('push:vientos-idp:' + GIT_REF, (data) => {
  console.log('IDP')
  execFile(`${SCRIPTS_PATH}/update-idp.sh`, execOptions, (err, stdout, stderr) => {
    if (err) console.log(err)
    if (stderr) console.log(stderr)
    console.log(stdout)
  })
})
