#!/bin/bash
rm -rf ../valleyjs/lib
rm -rf ../valleyjs/jquerylib
rm -rf ../valleyjs/third
rm -rf ../valleyjs/config
rm -rf ../valleyjs/utils
cp -r lib ../valleyjs/
cp -r jquerylib ../valleyjs/
cp -r third ../valleyjs/
cp -r config ../valleyjs/
cp -r utils ../valleyjs/
cp -r main.js ../valleyjs/
cp -r valley.js ../valleyjs/
