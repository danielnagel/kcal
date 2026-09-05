#!/bin/bash

# create dist dir
mkdir -p dist/public

# copy src files
cp src/assets/favicon.ico dist/public
cp src/views/scripts/*.js dist/public
cp src/views/styles/*.css dist/public
cp src/views/*.html dist/public

# copy pwa files
cp src/serviceworker.js dist/public
cp src/manifest.json dist/public

# copy chart.js files
cp node_modules/chart.js/dist/chart.umd.js dist/public
cp node_modules/chart.js/dist/chart.umd.js.map dist/public

if [ "$1" == "production" ]; then
    # package*.json is needed in dist so postbuild:production (npm i
    # --omit=dev) can install just the production deps there - see the
    # Dockerfile build stage.
    cp package*.json dist
fi