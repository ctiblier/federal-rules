#!/bin/bash
# Copy rule Markdown files from scraper output to Astro content directory.
# Usage: ./scripts/copy-content.sh [path/to/FedRules/output/rules]
#
# The scraper outputs files as rule-N/current.md.
# This script copies them to src/content/rules/N.md (filename = rule number).

RULES_DIR=${1:-"../FedRules/output/rules"}
DEST="src/content/rules"

mkdir -p "$DEST"

count=0
for rule_dir in "$RULES_DIR"/rule-*/; do
  rule_num=$(basename "$rule_dir" | sed 's/rule-//')
  src="$rule_dir/current.md"
  if [ -f "$src" ]; then
    # Decimal rules get "rule-" prefix to avoid Astro ID collision
    if echo "$rule_num" | grep -q '\.'; then
      dest_file="$DEST/rule-$rule_num.md"
    else
      dest_file="$DEST/$rule_num.md"
    fi
    cp "$src" "$dest_file"
    count=$((count + 1))
  fi
done

echo "Done. $count rules copied to $DEST."
