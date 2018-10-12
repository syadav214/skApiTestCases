#!/bin/sh
for fileName in tests/*.js; do
    ./node_modules/mocha/bin/mocha $fileName
done
