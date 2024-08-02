#!/bin/bash

# depends on inotify-tools (sudo apt-get install inotify-tools)
# https://stackoverflow.com/questions/8699293/how-to-monitor-a-complete-directory-tree-for-changes-in-linux

while true; do
    inotifywait -r src -e modify,create,delete,move && \
    echo "generating new bundle..." && \
    ./bundle.sh && \
    echo "done"
done