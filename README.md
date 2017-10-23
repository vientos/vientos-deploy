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

## Nginx

Included in this repo `nginx.conf` provides a template which one can use for *production* and *staging* deployments
* [x] listens on IPv4 and IPv6 interfaces
* [x] uses HTTP/2
* [x] enables gzip compression
* [x] uses *Let's Encrypt* certificates *(more detais in next section)*
* [x] redirects HTTP to HTTPS
* [x] servers `index.html` for app if requested path doesn't exist
* [x] disables buffering on data service *(needed for Server Sent Events to work)*
* [ ] sets max body size

## TLS

### Certbot

To install latest version, follow [official instructions](https://certbot.eff.org/#pip-other) *(just the install part)*

You will also need latest `libssl-dev` you can find the latest version with
```bash
apt-cache show libssl-dev
```
and then install it with *(adjusting the version number)*
 ```bash
 apt install libssl-dev=1.0.2l-1~bpo8+1
 ```

### autorenew
[Let's Encrypt](http://letsencrypt.org/) setup follows one in [officia Nginx post](https://www.nginx.com/blog/using-free-ssltls-certificates-from-lets-encrypt-with-nginx/)

create cron job `crontab -e` and setup daily (2am) autorenewal
```
0 2 * * * ~/bin/certbot-auto renew --nginx --no-self-upgrade --quiet
```
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
