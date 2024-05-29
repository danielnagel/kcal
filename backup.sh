#!/bin/bash

# Variablen definieren
SOURCE_FILE="/home/daniel/git/kcal/dist/data/data.json"
TARGET_DIR="/mnt/backup/documents/projects/kcal"

# Heutiges Datum im Format YYYY-MM-DD
TODAY=$(date +"%Y-%m-%d")

# Dateinamen aus der Quelldatei extrahieren
FILE_NAME=$(basename "$SOURCE_FILE")

# Zielpfad mit neuem Dateinamen
TARGET_FILE="${TARGET_DIR}/${TODAY}_${FILE_NAME}"

# Datei kopieren und umbenennen
cp "$SOURCE_FILE" "$TARGET_FILE"

echo "Backup erfolgreich ($TARGET_FILE)."

# Dateien löschen, die älter als 60 Tage sind
DELETED_FILES=$(find "$TARGET_DIR" -type f -mtime +60 -print -delete)

if [ -n "$DELETED_FILES" ]; then
    echo "Veraltete Backups wurden gelöscht."
fi