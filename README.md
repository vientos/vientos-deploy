# vientos-deploy

[Ansible](https://docs.ansible.com/ansible) playbook to deploy vientos stack

It assumes Ubuntu 18.04TLS, playbook tested to work in [LXD](https://linuxcontainers.org/lxd/introduction/) containers

## Usage

### configure

#### hosts.yml

Firs of all add entry to `inventory/hosts.yml` following other existin entries and [ansible inventory documentation](https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html) eg.

```yaml
mx:
  children:
    mx-staging:
      hosts:
        staging.vientos.coop:
          ansible_host: 136.243.86.184
          ansible_port: 2222
          ansible_python_interpreter: /usr/bin/python3
```

#### group_vars

Add configuration specific to the group of hosts you maintain to `inventory/group_vars/` eg.

`inventory.group_vars/mx.yml`
```yaml
---
ssh_key_urls:
  - https://github.com/elf-pavlik.keys
language: es
country: mx
map:
  latitude: 19.43
  longitude: -99.13
  zoom: 9
  tilelayer: "https://api.mapbox.com/styles/v1/vientos/cixqjuql4002y2rrsrjy004fg/tiles/256/{z}/{x}/{y}@2x?access_token=
```

#### host_vars

Configuration specific to each host goes to `inventory/host_vars/`, you need to create a directory for each host with two files in it `config.yml` and `secrets.yml` (this one stays git ignored!) eg.

`inventory/host_vars/staging.vientos.coop/config.yml`
```yaml
---
common:
  env: staging

app:
  name: app
  domain: staging.vientos.coop

service:
  name: service
  domain: data.staging.vientos.coop
  port: 8000

idp:
  name: idp
  domain: idp.staging.vientos.coop
  port: 8001

webhooks:
  name: webhooks
  domain: webhooks.staging.vientos.coop
  port: 8002
```

To disable any of the services simply leave its `domain` undefined eg.

```
common:
  env: staging

app:
  name: app

service:
  name: service
  domain: data.staging.vientos.coop
  port: 8000

idp:
  name: idp

webhooks:
  name: webhooks
```

`inventory/host_vars/staging.vientos.coop/secrets.yml`
```yaml
---
secrets:
  common:
    letsencryptEmail: # email used to agree to Let's encrypt Terms of Service
    fromEmail: # email used as *From* in emails sent by service and idp
    mailjet:
      public: # get it from
      secret: # get it from 

  app:
    sentry: # get it from https://sentry.io/settings/
    google:
        apiKey: # get it from https://console.developers.google.com
    cloudinary:
      cloud: # get it from https://cloudinary.com/console
      preset: # get it from https://cloudinary.com/console/settings/upload

  service:
    cookie: # generate eg. openssl rand -base64 32
    sentry: # get it from https://sentry.io/settings/
    google:
      clientId: # get it from https://console.developers.google.com
      clientSecret: # get it from https://console.developers.google.com
      gcmApiKey: # get it from https://console.developers.google.com
    facebook:
      clientId: # get it from https://developers.facebook.com/
      clientSecret: # get it from https://developers.facebook.com/

  idp:
    cookie: # generate eg. openssl rand -base64 32
    sentry: # get it from https://sentry.io/settings/
    clientId: # choose one eg. staging-idp
    clientSecret: # generate eg. openssl rand -base64 32

  webhooks:
    secret: # set in https://github.com/vientos/{repo}/settings/hooks

```

### run

`ansible-playbook site.yml`

#### test run

For testing purposes Let's Encrypt provides a staging environemnt

`ansible-playbook site.yml --extra-vars "letsencrypt_staging=yes"`

## Details

### 3rd party services

* Cloudinary - http://cloudinary.com
* Google - https://console.developers.google.com
  * Firebase - https://console.firebase.google.com
* Facebook - https://developers.facebook.com/
* Sentry - https://sentry.io
* Github - https://github.com

### Nginx

Included in this repo `nginx.conf` provides a template which one can use for *production* and *staging* deployments
* [x] listens on IPv4 and IPv6 interfaces
* [x] uses HTTP/2
* [x] enables gzip compression
* [x] uses *Let's Encrypt* certificates
* [x] redirects HTTP to HTTPS
* [x] servers `index.html` for app if requested path doesn't exist
* [x] disables buffering on data service *(needed for Server Sent Events to work)*
* [ ] sets max body size

### Backups

#### SSH setup

add public key of unprivileged user `.ssh/id_rsa.pub` to `.ssh/authorized_keys` of the account on the server you want back up to.

#### dump
create cron job `crontab -e` and setup daily (4am) backups
```
0 4 * * * ~/backup.sh
```

#### restore
one can restore from archive using
```
mongorestore --gzip --archive=service.gz
mongorestore --gzip --archive=idp.gz
```
