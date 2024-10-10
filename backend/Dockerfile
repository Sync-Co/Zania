# backend/Dockerfile
FROM --platform=linux/amd64 python:3.9-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose the port
EXPOSE 8000

# Command to initialize the database and then run the FastAPI application
CMD python database_init.py && uvicorn main:app --host 0.0.0.0 --port 8000