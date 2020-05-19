#!/bin/bash

set -e

BUILD_DIR_PATH="$PWD"/build

# setting up build dir
if test -f $BUILD_DIR_PATH; then
  rm -rf $BUILD_DIR_PATH
fi
mkdir -p $BUILD_DIR_PATH

DESTINATION_PATH=${2:-$BUILD_DIR_PATH}

# Senior Leadership Dashboard
# Copying across assets
ASSETS_PATH="./assets"
cp -r $ASSETS_PATH $BUILD_DIR_PATH/$ASSETS_PATH

# Copying html
cp *.html $BUILD_DIR_PATH/

# General Dashboard
RESOURCES_PATH="./resources"
python3 bin/build-general-dash.py --template "$RESOURCES_PATH/ct-covid-dash-general.html" --output-path $BUILD_DIR_PATH/
python3 bin/build-general-dash.py --template "$RESOURCES_PATH/ct-covid-dash-sa-general.html" --output-path $BUILD_DIR_PATH/
python3 bin/build-general-dash.py --template "$RESOURCES_PATH/ct-covid-dash-int-general.html" --output-path $BUILD_DIR_PATH/

# Zipping up
DIST_DEFAULT_PATH="./dist"
DIST_PATH=${3:-$DIST_DEFAULT_PATH}
mkdir -p $DIST_PATH

file=../"$DIST_PATH"/covid-19-dashboard.zip

cd $DESTINATION_PATH
# Removing old version
if test -f "$file"; then
    rm $file
fi

# Creating new version
cd $BUILD_DIR_PATH
zip -r $file $ASSETS_PATH *.html
cd -