#!/bin/bash

set -e

BUILD_DIR_PATH="$PWD"/build

SECRETS_FILE_PATH=${1:-/secrets/secrets.json}
DESTINATION_PATH=${2:-$BUILD_DIR_PATH}

mkdir -p $DESTINATION_PATH

minio_bucket_dir_sync.py -s minio://covid -d "$DESTINATION_PATH" -c EDGE -x "$SECRETS_FILE_PATH"