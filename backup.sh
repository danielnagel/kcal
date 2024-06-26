#!/bin/bash

TEMP_PROJECT_DIR="$(dirname "${BASH_SOURCE[0]}")"
ENVIRONMENT_FILE="$TEMP_PROJECT_DIR/.env"

if [ -f "$ENVIRONMENT_FILE" ]; then
    source "$ENVIRONMENT_FILE"
    
    # Check if PROJECT_DIR is set and not empty
    if [ -n "$PROJECT_DIR" ] && [ -n "$BACKUP_DIR" ]; then
        # Variablen definieren
        SOURCE_FILE="$PROJECT_DIR/dist/data/*.json"
        TARGET_DIR="$BACKUP_DIR"

        # Heutiges Datum im Format YYYY-MM-DD
        TODAY=$(date +"%Y-%m-%d")

        # Dateinamen aus der Quelldatei extrahieren
        FILE_NAME=$(basename "$SOURCE_FILE")

        # Zielpfad mit neuem Dateinamen
        TARGET_FILE="${TARGET_DIR}/${TODAY}_${FILE_NAME}"

        # Datei kopieren und umbenennen
        cp "$SOURCE_FILE" "$TARGET_FILE"

        echo "Backup successful ($TARGET_FILE)."

        # Dateien löschen, die älter als 60 Tage sind
        DELETED_FILES=$(find "$TARGET_DIR" -type f -mtime +60 -print -delete)

        if [ -n "$DELETED_FILES" ]; then
            echo "Outdated backups have been deleted."
        fi
    fi
else
    echo ".env file not found."
    echo "run 'cp example.env .env' and set environment variables to your environment."
fi

