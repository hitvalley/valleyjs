#!/bin/bash
echo "(function(global){" > tpl.js
cat initTpl.js >> tpl.js
cat sprintf.js >> tpl.js
cat node.js >> tpl.js
cat core.js >> tpl.js
cat funcs.js >> tpl.js
echo "}(Valley));" >> tpl.js
