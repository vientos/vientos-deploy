cd $IDP_DIR
git pull --rebase
npm install
pm2 restart idp
