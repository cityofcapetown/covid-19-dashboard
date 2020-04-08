#!/bin/bash
set -e

# Getting and unzipping files
DEPLOY_DIR=dist
mkdir -p ./"$DEPLOY_DIR"

DEPLOY_PATH=https://ds2.capetown.gov.za/covid-19-dashboard-deploy
DEPLOY_FILE=covid-19-dashboard.zip
curl "$DEPLOY_PATH"/"$DEPLOY_FILE" -o "$DEPLOY_DIR"/"$DEPLOY_FILE"

cd $DEPLOY_DIR
unzip "$DEPLOY_FILE"
cd ..

# Uplading
BUCKET_NAME=covid
# HTML
for html_file in $(ls dist/*.html); do
  ./bin/minio-upload.sh "$html_file" "text/html" "$BUCKET_NAME"
done

# Assets - CSS
for css_file in $(ls dist/assets/css/*.css); do
  ./bin/minio-upload.sh "$css_file" "text/css" "$BUCKET_NAME"/assets/css
done

# Assets - JS
for js_file in $(ls dist/assets/js/*.js); do
  ./bin/minio-upload.sh "$js_file" "text/javascript" "$BUCKET_NAME"/assets/js
done

# Assets - imgs
# PNGs
for js_file in $(ls dist/assets/imgs/*.png); do
  ./bin/minio-upload.sh "$js_file" "image/png" "$BUCKET_NAME"/assets/imgs
done

for js_file in $(ls dist/assets/imgs/*.svg); do
  ./bin/minio-upload.sh "$js_file" "image/svg+xml" "$BUCKET_NAME"/assets/imgs
done