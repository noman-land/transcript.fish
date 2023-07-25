set -eu

indb="$1"
outdir="$2"

# for chunked mode, we need to know the database size in bytes beforehand
bytes="$(stat -f "%z" "$indb")"
# set chunk size to 8MiB (needs to be a multiple of the `pragma page_size`!)
serverChunkSize=$((8 * 1024 * 1024))
suffixLength=3
rm -f "$outdir/db.sqlite3"*
split -d -b $serverChunkSize -a $suffixLength "$indb" "$outdir/db.sqlite3."

# set request chunk size to match page size
requestChunkSize="$(sqlite3 "$indb" 'pragma page_size')"

# write a json config
echo '{
  "serverMode": "chunked",
  "requestChunkSize": '$requestChunkSize',
  "databaseLengthBytes": '$bytes',
  "serverChunkSize": '$serverChunkSize',
  "urlPrefix": "db.sqlite3.",
  "suffixLength": '$suffixLength'
}' > "$outdir/config.json"
