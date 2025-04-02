FROM python:3.10-slim

WORKDIR /app

# Install curl for health checks and sudo for entrypoint
RUN apt-get update && apt-get install -y curl sudo && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Download NLTK data required by TextBlob
RUN python -m nltk.downloader punkt

# Copy the application code
COPY . .

# Copy the entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Create non-root user and group
RUN addgroup --system appgroup && adduser --system --ingroup appgroup --disabled-password --gecos '' appuser

# Create data directory with proper permissions
RUN mkdir -p /app/data && \
    chown -R appuser:appgroup /app && \
    chmod -R 755 /app && \
    chmod 777 /app/data

# Initialize database file with proper permissions
RUN touch /app/data/xnote.db && \
    chown appuser:appgroup /app/data/xnote.db && \
    chmod 666 /app/data/xnote.db

USER appuser

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Expose the port
EXPOSE 8000

# Set the entrypoint script
ENTRYPOINT ["/entrypoint.sh"]

# Command to run the application (passed to entrypoint)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"] 