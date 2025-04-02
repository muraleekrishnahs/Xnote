#!/bin/sh

# Output debugging information about file ownership and permissions
echo "Current permissions on data directory:"
ls -la /app/data

# Create the database file if it doesn't exist
touch /app/data/xnote.db

# Print DB file permissions
echo "Database file permissions:"
ls -la /app/data/xnote.db

# Execute the command passed to the entrypoint script (e.g., uvicorn)
exec "$@" 