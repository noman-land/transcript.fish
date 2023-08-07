set -eu

db_path="./db/transcript.db"
latest=$(date -r "$db_path" "+%s")
echo '{ "latest": '$latest' }' > ./db/latest.json
output_dir="./db/$latest"

if ! test -d "$output_dir"; then
  mkdir "$output_dir";
  # for chunked mode, we need to know the database size in bytes beforehand
  bytes="$(stat -f "%z" "$db_path")"
  # set chunk size to 4MiB (needs to be a multiple of the `pragma page_size`!)
  server_chunk_size=$((4 * 1024 * 1024))
  suffix_length=3
  rm -f "$output_dir/db.sqlite3"*
  split -d -b $server_chunk_size -a $suffix_length "$db_path" "$output_dir/db.sqlite3."

  # set request chunk size to match page size
  request_chunk_size="$(sqlite3 "$db_path" 'pragma page_size')"

  # write a json config
  echo '{
    "serverMode": "chunked",
    "requestChunkSize": '$request_chunk_size',
    "databaseLengthBytes": '$bytes',
    "serverChunkSize": '$server_chunk_size',
    "urlPrefix": "db.sqlite3.",
    "suffixLength": '$suffix_length'
  }' > "$output_dir/config.json"
else
  echo '-- Remote database is up to date. Skipping upload.'
fi

