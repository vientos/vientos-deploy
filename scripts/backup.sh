SOURCE=~/backups
DESTINATION=user@host:backups
CURRENT=$SOURCE/`date -I`
mkdir $CURRENT

mongodump --db production-service --archive=$CURRENT/service.gz --gzip
mongodump --db production-idp  --archive=$CURRENT/idp.gz --gzip

rsync -a $SOURCE/ $DESTINATION
