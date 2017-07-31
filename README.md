# vientos-deploy

for Debian 8 (Jessie)

## dependencies

* MongoDB - https://docs.mongodb.com/manual/tutorial/install-mongodb-on-debian/
* Nginx - https://www.linuxbabe.com/nginx/enable-http2-debian-8-nginx-web-server
  * HTTP/2 ALPN - https://sergii.rocks/feed/post/nginx-http2-with-alpn-on-debian-8-jessie
* Certbot - https://certbot.eff.org/#debianjessie-nginx
* NVM - https://github.com/creationix/nvm#installation

## 3rd party services

* Cloudinary - http://cloudinary.com
* Google - https://console.developers.google.com
  * Firebase - https://console.firebase.google.com
* Facebook - https://developers.facebook.com/
* Sentry - https://sentry.io
* Github - https://github.com

## Backups

### SSH setup

1. generate ssh keys on the server you deploy to
```bash
ssh-keygen
```
2. add public key `.ssh/id_rsa.pub` to `.ssh/authorized_keys` of the account on the server
you want back up to.

### dump
create cron job `crontab -e` and setup daily (4am) backups
```
0 4 * * * ~/backup.sh
```

### restore
one can restore from archive using
```
mongorestore --gzip --archive=service.gz
mongorestore --gzip --archive=idp.gz
```
