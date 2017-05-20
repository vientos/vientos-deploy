const fs = require('fs')
const execFile = require('child_process').execFile
const gh = require('githubhook')({
  path: '/callback',
  port: process.env.PORT,
  secret: process.env.WEBHOOKS_SECRET,
  https: {
    key: fs.readFileSync(process.env.TLS_KEY_PATH),
    cert: fs.readFileSync(process.env.TLS_CERT_PATH)
  }
})
const GIT_REF = process.env.GIT_REF

// Increase maxBuffer from 200*1024 to 1024*1024
const execOptions = {
  maxBuffer: 1024 * 1024 // 1mb
}

gh.listen()

gh.on('push:vientos-pwa:' + GIT_REF, (data) => {
  console.log('PWA')
  execFile('scripts/update-pwa.sh', execOptions, (err, stdout, stderr) => {
    if (err) console.log(err)
    if (stderr) console.log(stderr)
    console.log(stdout)
  })
})

gh.on('push:vientos-service', (ref, data) => {
  console.log('SERVICE', ref)
})
