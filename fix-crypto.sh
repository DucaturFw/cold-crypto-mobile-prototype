#!/bin/bash
STREAMS=(
	./node_modules/cipher-base/index.js
	./node_modules/hash-base/index.js
)
CRYPTOS=(

)
# echo sed -i.bak -e 's/require\(["'\'']crypto["'\'']\)/require\(\"crypto-browserify\"\)/g' $CRYPTOS
# sed "s/require([\"']crypto[\"'])/require\\(\"crypto-browserify\"\\)/g" test.txt
# sed -i.bak "s/require([\"']crypto[\"'])/require\(\"crypto-browserify\"\)/g" $CRYPTOS
sed -i.bak "s/require([\"']stream[\"'])/require\(\"readable-stream\"\)/g" "${STREAMS[@]}"
sed -i.bak "s/require([\"']crypto[\"'])/require\(\"crypto-browserify\"\)/g" "${CRYPTOS[@]}"
# echo sed -i.bak -e 's/require\(["'\'']stream["'\'']\)/require\(\"readable-stream\"\)/g' $STREAMS
