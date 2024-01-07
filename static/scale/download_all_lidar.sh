#!/bin/bash

# Save the current directory.
original_dir=$(pwd)

# Find all 'links.txt' files in the current directory and its subdirectories.
find . -name 'links.txt' | while read file; do
  # Get the directory of the file.
  dir=$(dirname "$file")

  # Change to the directory of the file.
  cd "$original_dir/$dir"

  # Download the files.
  cat 'links.txt' | xargs -n 1 wget

  # Change back to the original directory.
  cd "$original_dir"
done