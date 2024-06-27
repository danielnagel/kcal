#!/bin/bash

TEMP_PROJECT_DIR="$(dirname "${BASH_SOURCE[0]}")"
ENVIRONMENT_FILE="$TEMP_PROJECT_DIR/.env"

if [ -f "$ENVIRONMENT_FILE" ]; then
    source "$ENVIRONMENT_FILE"
    
    if [ -n "$PROJECT_DIR" ] && [ -n "$BACKUP_DIR" ]; then
        SOURCE_DIR="$PROJECT_DIR/dist/data"
        TARGET_DIR="$BACKUP_DIR"

        TODAY=$(date +"%Y-%m-%d")

        for SOURCE_FILE in "$SOURCE_DIR"/*; do
            if [ -f "$SOURCE_FILE" ]; then
                FILE_NAME=$(basename "$SOURCE_FILE")
                TARGET_FILE="${TARGET_DIR}/${TODAY}_${FILE_NAME}"
                cp "$SOURCE_FILE" "$TARGET_FILE"
                echo "Backup successful ($TARGET_FILE)."
            fi
        done

        DELETED_FILES=$(find "$TARGET_DIR" -type f -mtime +30 -print -delete)

        if [ -n "$DELETED_FILES" ]; then
            echo "Outdated backups have been deleted."
        fi
    else
        echo "PROJECT_DIR or BACKUP_DIR is not set or is empty in the .env file."
    fi
else
    echo ".env file not found."
    echo "Run 'cp example.env .env' and set environment variables to your environment."
fi
