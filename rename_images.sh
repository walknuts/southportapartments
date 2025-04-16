#!/bin/bash

# Rename files in pages directory
echo "Renaming files in assets/images/pages/"
for file in assets/images/pages/*; do
  if [[ -f "$file" ]]; then
    filename=$(basename "$file")
    newname=$(echo "$filename" | tr '[:upper:]' '[:lower:]' | sed 's/-attachment//g')
    if [[ "$filename" != "$newname" ]]; then
      mv "$file" "assets/images/pages/$newname"
      echo "Renamed: $filename to $newname"
    fi
  fi
done

# Rename files in blog directory
echo "Renaming files in assets/images/blog/"
for file in assets/images/blog/*; do
  if [[ -f "$file" ]]; then
    filename=$(basename "$file")
    newname=$(echo "$filename" | tr '[:upper:]' '[:lower:]' | sed 's/-attachment//g')
    if [[ "$filename" != "$newname" ]]; then
      mv "$file" "assets/images/blog/$newname"
      echo "Renamed: $filename to $newname"
    fi
  fi
done

echo "All files renamed!"