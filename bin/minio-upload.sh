#!/usr/bin/env bash
set -e

# Passed in params
file=$1
file_type=$2
bucket=$3

# various header construction
filename=$(basename $file)
resource="/${bucket}/${filename}"
contentType=$file_type
dateValue=$(date -R)
stringToSign="PUT\\n\\n${contentType}\\n${dateValue}\\n${resource}"
signature=$(echo -en ${stringToSign} | openssl sha1 -hmac ${MINIO_SECRET} -binary | base64)

# Upload!
MINIO_HOSTNAME=https://ds2.capetown.gov.za
curl -v --fail \
  -X PUT -T "${file}" \
  -H "Host: ds2.capetown.gov.za" \
  -H "Date: ${dateValue}" \
  -H "Content-Type: ${contentType}" \
  -H "Authorization: AWS ${MINIO_ACCESS}:${signature}" \
  ${MINIO_HOSTNAME}${resource}

exit $?
