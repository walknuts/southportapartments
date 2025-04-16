#!/bin/bash

# Create destination directories if they don't exist
mkdir -p assets/images/blog assets/images/pages

# Process all image files in the attachments directory
for file in assets/images/attachments/*; do
  # Get the base filename
  filename=$(basename "$file")
  
  # Determine the destination directory
  if [[ "$filename" == 7-BLOG* ]]; then
    destdir="assets/images/blog"
  else
    destdir="assets/images/pages"
  fi
  
  # Create the new filename: lowercase and remove "-attachment"
  newname=$(echo "$filename" | tr '[:upper:]' '[:lower:]' | sed 's/-attachment//g')
  
  # Copy the file to its new location
  cp "$file" "$destdir/$newname"
  
  echo "Moved: $file to $destdir/$newname"
done

echo "All files processed!"