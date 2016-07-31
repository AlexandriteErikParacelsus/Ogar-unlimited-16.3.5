#!/bin/bash
if pwd | grep -qw "src"; then
    node index.js
else
    echo "You must run Ogar Unlimited from the src folder!"
fi
