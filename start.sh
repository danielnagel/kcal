#! /bin/bash

if [ -f .env ]; then
    source .env
    
    # Check if PROJECT_DIR is set and not empty
    if [ -n "$PROJECT_DIR" ]; then
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

        cd "$PROJECT_DIR"
        npm start
    fi
else
    echo ".env file not found."
    echo "run 'cp example.env .env' and set environment variables to your environment."
fi
