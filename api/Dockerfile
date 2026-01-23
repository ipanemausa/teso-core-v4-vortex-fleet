# 🦅 TESO CLOUD BACKEND (Production Dockerfile)
# Based on Python 3.10 Slim for efficiency and security.

FROM python:3.10-slim

# 1. Environment Variables (Python optimizations)
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

# 2. Work Directory
WORKDIR /app

# 3. System Dependencies (Clean up apt to reduce image size)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 4. Install Python Dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# 5. Application Code
COPY . .

# 6. Security: Create Non-Root User "teso_guardian"
RUN adduser --disabled-password --gecos "" teso_guardian && \
    chown -R teso_guardian:teso_guardian /app
USER teso_guardian

# 7. Expose Port
EXPOSE 8000

# 8. Launch Command (Gunicorn Process Manager)
# -w 4: 4 Worker Processes (Adjust based on CPU)
# -k uvicorn.workers.UvicornWorker: High-performance ASGI worker
# --bind 0.0.0.0:$PORT: Bind to the environment port
CMD gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:$PORT
