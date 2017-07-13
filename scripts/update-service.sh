cd $SERVICE_DIR
git pull --rebase
npm install
pm2 restart data
