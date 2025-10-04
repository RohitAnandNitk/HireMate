# ---------- Base Image ----------
FROM python:3.12-slim

# ---------- Set environment variables ----------
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

# ---------- Set working directory ----------
WORKDIR /app

# ---------- Install essential system dependencies ----------
# These are needed for common Python packages like cryptography, PyMuPDF, and psycopg2
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libssl-dev \
    libffi-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# ---------- Copy dependency list ----------
COPY requirements.txt .

# ---------- Install Python dependencies ----------
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ---------- Copy project files ----------
COPY . .

# ---------- Default command: Run Celery Worker ----------
# Points directly to the Celery instance in celery_app.py
CMD ["celery", "-A", "celery_app.celery", "worker", "--loglevel=info"]
