# Use official Python image
FROM python:3.12-slim AS base

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    python3-dev \
    libffi-dev \
    libssl-dev \
    libblas-dev \
    liblapack-dev \
    gfortran \
    libopenblas-dev \
    libatlas-base-dev \
    && curl -sSL https://install.python-poetry.org | python3 - \
    && rm -rf /var/lib/apt/lists/*

# Add Poetry to PATH
ENV PATH="/root/.local/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy the project files
COPY ./backend/pyproject.toml ./backend/poetry.lock ./backend/README.md ./
COPY ./backend/src/ /app/src/

RUN pip install --no-cache-dir --prefer-binary blis

RUN poetry config virtualenvs.create true && poetry config virtualenvs.in-project true

# Install dependencies
RUN poetry install

ENV PATH="/app/.venv/bin:$PATH"


# Start FastAPI server
CMD ["poetry", "run", "python", "src/main.py"]
