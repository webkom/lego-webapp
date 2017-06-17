#!/bin/bash

# List of CSS files to write into markdown file
STYLE_FILES=(
"app/styles/variables.css"
"app/styles/utilities.css"
)

HIGHLIGHT_LANG="less"

OUTPUT_FILE="./.css.tmp.md"

rm -f $OUTPUT_FILE

for file in "${STYLE_FILES[@]}"; do
echo \
"## File: $file
\`\`\`$HIGHLIGHT_LANG
$(cat "$file")
\`\`\`

">> $OUTPUT_FILE

done
