# ==========================================
# STAGE 1: Frontend Build (Vite/Node)
# ==========================================
FROM node:18-alpine as frontend_builder

WORKDIR /app/web

# Copy package requirements first for caching
COPY web/package*.json ./
RUN npm ci

# Copy source code
COPY web/ .

# Build the SPA (Output goes to /app/web/dist)
RUN npm run build

# ==========================================
# STAGE 2: Backend Runtime (Python/FastAPI)
# ==========================================
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies (if any needed for pandas/numpy)
# RUN apt-get update && apt-get install -y ...

# Copy API constraints
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# --- FIX: COPY SIMULATION MODULE ---
# We recreate the package structure 'teso_core/simulation' 
# so the import 'from teso_core.simulation...' works.
COPY simulation/ ./teso_core/simulation/
# Create an empty __init__.py to ensure teso_core is treated as a package if missing
RUN touch teso_core/__init__.py

# Copy API Source Code to root of /app
COPY api/ .

# Ensure /app is in PYTHONPATH so 'teso_core' can be imported
ENV PYTHONPATH=/app

# Copy Frontend Build from Stage 1 -> /app/static
# FastAPI is configured to serve static files from ./static
COPY --from=frontend_builder /app/web/dist ./static

# Expose Port (Fly.io default is 8080 usually, or we set via ENV)
ENV PORT=7860
EXPOSE 7860

# Run Uvicorn
# main:app refers to main.py object 'app'
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
