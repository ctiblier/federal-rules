#!/bin/bash
# Copy rule Markdown files from scraper output to Astro content directory.
# Usage: ./scripts/copy-content.sh [path/to/output/rules] [dest-content-dir]
#
# The scraper outputs versioned files as rule-N/current.md, rule-N/2025.md, etc.
# This script mirrors the folder structure into the destination content directory.

RULES_DIR=${1:-"../FedRules/output/rules"}
DEST=${2:-"src/content/civil"}

mkdir -p "$DEST"

# Clear existing content so removed rules don't linger
rm -rf "$DEST"/rule-*/
# Also clear any legacy flat files from before the folder restructure
rm -f "$DEST"/*.md "$DEST"/rule-*.md 2>/dev/null

count=0
for rule_dir in "$RULES_DIR"/rule-*/; do
  rule_num=$(basename "$rule_dir" | sed 's/rule-//')
  # Replace dots with underscores in folder names to avoid Astro content ID
  # collisions (e.g. rule-4.1/ would collide with rule-41/ after dot-stripping).
  safe_num=$(echo "$rule_num" | tr '.' '_')
  dest_dir="$DEST/rule-$safe_num"
  mkdir -p "$dest_dir"
  for src in "$rule_dir"*.md; do
    [ -f "$src" ] || continue
    cp "$src" "$dest_dir/"
    count=$((count + 1))
  done
done

echo "Done. $count files copied to $DEST."
