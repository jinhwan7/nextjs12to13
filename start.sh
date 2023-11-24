#/usr/bin/bash

node index.js
npx jscodeshift -t ./transform.js ./my-javascripts