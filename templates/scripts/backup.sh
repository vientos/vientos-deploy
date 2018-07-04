SOURCE=~/backups
DESTINATION=user@host:backups
CURRENT=$SOURCE/`date -I`
mkdir $CURRENT

mongodump --db production-service --gzip --archive=$CURRENT/service.gz
mongodump --db production-idp --gzip --archive=$CURRENT/idp.gz

rsync -a $SOURCE/ $DESTINATION
