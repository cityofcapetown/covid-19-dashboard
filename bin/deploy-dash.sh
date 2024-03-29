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

# Assets - JSON
for js_file in $(ls dist/assets/js/*.json); do
  ./bin/minio-upload.sh "$js_file" "application/json" "$BUCKET_NAME"/assets/js
done

# Assets - imgs
# PNGs
for png_file in $(ls dist/assets/imgs/*.png); do
  ./bin/minio-upload.sh "$png_file" "image/png" "$BUCKET_NAME"/assets/imgs
done

# SVGs
for svg_file in $(ls dist/assets/imgs/*.svg); do
  ./bin/minio-upload.sh "$svg_file" "image/svg+xml" "$BUCKET_NAME"/assets/imgs
done

# MP4s
for mp4_file in $(ls dist/assets/imgs/*.mp4); do
  ./bin/minio-upload.sh "$mp4_file" "video/mp4" "$BUCKET_NAME"/assets/imgs
done