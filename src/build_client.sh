#!/bin/bash
cd tpl
sh build.sh
cd ..
sh ./build.sh jquery
scp ../client/valley.js valley@10.144.73.232:~/valley_js/client/valley.0.6_2.js
scp ../client/valley.js valley@115.29.36.124:/mnt/vcode/valleyjs_static/valley.0.6_2.js

