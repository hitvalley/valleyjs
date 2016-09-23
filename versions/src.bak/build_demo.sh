#!/bin/bash
rm -rf ../demo/valleyjs/lib
rm -rf ../demo/valleyjs/mvc
rm -rf ../demo/valleyjs/client
rm -rf ../demo/valleyjs/server
cp -r lib ../demo/valleyjs/
cp -r mvc ../demo/valleyjs/
cp -r client ../demo/valleyjs/
cp -r server ../demo/valleyjs/
cp -r vlib.js ../demo/valleyjs/
cp -r valley.js ../demo/valleyjs/
