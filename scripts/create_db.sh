set -eu

db_path="./db/transcript.db"
# last modified date of database
latest=$(date -r "$db_path" "+%s")
output_dir="./db/$latest"

if ! test -d "$output_dir"; then
  # database size in bytes for chunked mode
  bytes="$(stat -f "%z" "$db_path")"
  # size of database chunk files. needs to be a multiple of `pragma page_size`
  server_chunk_size=$((4 * 1024 * 1024))
  # set request chunk size to match page size
  request_chunk_size="$(sqlite3 "$db_path" 'pragma page_size')"
  url_prefix="db.sqlite3."
  suffix_length=3

  mkdir "$output_dir";
  split -d -b $server_chunk_size -a $suffix_length "$db_path" "$output_dir/$url_prefix"

  # write timestamp of database modified date for FE cache busting
  echo '{ "latest": '$latest' }' > ./db/latest.json
  # write json config for database
  echo '{
    "serverMode": "chunked",
    "requestChunkSize": '$request_chunk_size',
    "databaseLengthBytes": '$bytes',
    "serverChunkSize": '$server_chunk_size',
    "urlPrefix": "'$url_prefix'",
    "suffixLength": '$suffix_length'
  }' > "$output_dir/config.json"
else
  echo '-- Database chunks are up to date'
fi

