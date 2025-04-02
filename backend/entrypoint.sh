#!/bin/sh

# Output debugging information about file ownership and permissions
echo "Current permissions on data directory:"
ls -la /app/data

# Create the database file if it doesn't exist
if [ ! -f /app/data/xnote.db ]; then
    echo "Creating new database file"
    touch /app/data/xnote.db
    chmod 666 /app/data/xnote.db
fi

# Print DB file permissions
echo "Database file permissions:"
ls -la /app/data/xnote.db

echo "Starting application with command: $@"

# Execute the command passed to the entrypoint script (e.g., uvicorn)
exec "$@" 