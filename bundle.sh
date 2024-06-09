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

# copy tabulator files
cp node_modules/tabulator-tables/dist/css/tabulator.min.css dist/public
cp node_modules/tabulator-tables/dist/css/tabulator.min.css.map dist/public
cp node_modules/tabulator-tables/dist/js/tabulator.min.js dist/public
cp node_modules/tabulator-tables/dist/js/tabulator.min.js.map dist/public

# copy chart.js files
cp node_modules/chart.js/dist/chart.umd.js dist/public
cp node_modules/chart.js/dist/chart.umd.js.map dist/public
   