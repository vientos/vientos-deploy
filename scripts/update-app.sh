cd $APP_DIR
git pull --rebase
npm install && bower install
npm run build
