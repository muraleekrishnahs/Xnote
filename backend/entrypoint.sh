#!/bin/sh
set -e

# Output debugging information
echo "======== ENVIRONMENT DEBUG INFO ========"
echo "Current user: $(whoami)"
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Output debugging information about file ownership and permissions
echo "Current permissions on data directory:"
ls -la /app/data

# Create the database file if it doesn't exist
if [ ! -f /app/data/xnote.db ]; then
    echo "Creating new database file"
    touch /app/data/xnote.db
    chmod 666 /app/data/xnote.db
else
    echo "Database file already exists"
fi

# Print DB file permissions
echo "Database file permissions:"
ls -la /app/data/xnote.db

# Print Python version and modules
echo "Python version:"
python --version
echo "Installed packages:"
pip list

echo "Starting application with command: $@"
echo "======== END DEBUG INFO ========"

# Check if this is a health check (ps grep doesn't find itself)
if echo "$@" | grep -q "ps aux"; then
    echo "Health check detected, running: $@"
    # Execute the health check command directly
    eval "$@"
    exit $?
fi

# Execute the command passed to the entrypoint script (e.g., uvicorn)
echo "Executing: $@"
exec "$@" 