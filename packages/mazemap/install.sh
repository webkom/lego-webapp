#!/bin/bash

# This script download the appropriate js api version from the mazemap servers

# Get version number from argument, if not default to a known version
VERSION=$1
if [[ -z $VERSION ]]; then
    VERSION="2.0.28"
fi

echo "Downloading MazeMap JS API version $VERSION from api.mazemap.com..."
curl "https://api.mazemap.com/js/v$VERSION/mazemap.min.js" -o mazemap.min.js
curl "https://api.mazemap.com/js/v$VERSION/mazemap.min.css" -o mazemap.min.css
echo "Finished"