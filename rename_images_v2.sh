#!/bin/bash

process_directory() {
  local dir=$1
  echo "Processing directory: $dir"
  # Use find to handle filenames safely
  find "$dir" -maxdepth 1 -type f | while IFS= read -r file; do
    filename=$(basename "$file")
    
    # Generate new name: lowercase, remove -attachment
    # This handles .jpg, .jpeg, .png extensions correctly
    newname=$(echo "$filename" | tr '[:upper:]' '[:lower:]' | sed 's/-attachment//g')

    # Only rename if the name actually changes
    if [[ "$filename" != "$newname" ]]; then
      # Construct full new path
      newpath="$dir/$newname"
      
      # Check if target already exists to avoid errors if run multiple times
      if [[ -e "$newpath" ]]; then
        echo "Skipping rename: Target $newpath already exists (maybe from previous run?)."
      else
        mv "$file" "$newpath"
        echo "Renamed: $filename to $newname in $dir"
      fi
    else
        # If the name doesn't change, it might already be correctly named
        echo "Skipping: $filename seems to already have the correct format."
    fi
  done
}

# Ensure the directories exist before processing
mkdir -p assets/images/pages
mkdir -p assets/images/blog

process_directory "assets/images/pages"
process_directory "assets/images/blog"

echo "Image renaming complete."