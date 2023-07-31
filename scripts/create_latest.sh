LATEST=$(date -r "./db/transcript.db" "+%s")
echo '{ "latest": '$LATEST' }' > ./db/latest.json
echo $LATEST
