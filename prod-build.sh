ng build --prod --aot=false --build-optimizer=false
cd dist
mv * /var/www/html/
