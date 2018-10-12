#!/bin/sh
for fileName in test/*.js; do
    ./node_modules/mocha/bin/mocha $fileName
done
