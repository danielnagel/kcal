#!/bin/bash

# Function to check if nvm is installed and install if not
check_and_install_nvm() {
  if ! command -v nvm &> /dev/null; then
    echo "nvm not found. Installing nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  else
    echo "nvm is already installed."
  fi
}

# Function to check if Node.js version 21 or higher is installed and install if not
check_and_install_node() {
  source ~/.nvm/nvm.sh
  NODE_VERSION=$(node -v | grep -oE '[0-9]+' | head -1)
  if [ -z "$NODE_VERSION" ] || [ "$NODE_VERSION" -lt 21 ]; then
    echo "Node.js version 21 or higher not found. Installing Node.js version 21..."
    nvm install 21
    nvm use 21
  else
    echo "Node.js version 21 or higher is already installed."
  fi
}

# Function to create a symbolic link
create_symlink() {
  local TARGET_FILE="$1"
  local LINK_NAME="$2"
  
  if [ ! -L "$LINK_NAME" ]; then
    ln -s "$TARGET_FILE" "$LINK_NAME"
    echo "Symbolic link $LINK_NAME created."
  else
    echo "Symbolic link $LINK_NAME already exists."
  fi
}

# Function to check and enable a systemd timer
enable_and_start_timer() {
  local TIMER_NAME="$1"
  
  if ! systemctl is-enabled --quiet "$TIMER_NAME"; then
    systemctl enable "$TIMER_NAME"
    echo "Systemd timer $TIMER_NAME enabled."
  else
    echo "Systemd timer $TIMER_NAME is already enabled."
  fi
  
  if ! systemctl is-active --quiet "$TIMER_NAME"; then
    systemctl start "$TIMER_NAME"
    echo "Systemd timer $TIMER_NAME started."
  else
    echo "Systemd timer $TIMER_NAME is already running."
  fi
}

# Function to check and restart or start a systemd service
restart_or_start_service() {
  local SERVICE_NAME="$1"
  
  if systemctl is-active --quiet "$SERVICE_NAME"; then
    systemctl restart "$SERVICE_NAME"
    echo "Systemd service $SERVICE_NAME restarted."
  else
    systemctl start "$SERVICE_NAME"
    echo "Systemd service $SERVICE_NAME started."
  fi
}

# Main script
check_and_install_nvm
check_and_install_node

if [ "$EUID" -ne 0 ]; then
    sudo "$0" "$@"
    exit $?
fi

PROJECT_DIR="/home/daniel/git/kcal"
create_symlink "$PROJECT_DIR/kcal.service" "/etc/systemd/system/kcal.service"
create_symlink "$PROJECT_DIR/backup-kcal.service" "/etc/systemd/system/backup-kcal.service"
create_symlink "$PROJECT_DIR/backup-kcal.timer" "/etc/systemd/system/backup-kcal.timer"

enable_and_start_timer "backup-kcal.timer"
restart_or_start_service "kcal.service"
