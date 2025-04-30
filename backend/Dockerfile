# Use GDAL base image with specific architecture
FROM --platform=linux/amd64 ghcr.io/osgeo/gdal:ubuntu-small-latest

# Set Lambda environment variables
ENV LAMBDA_TASK_ROOT=/var/task
ENV XDG_DATA_HOME=/tmp/pypsa_data

# Set working directory
WORKDIR ${LAMBDA_TASK_ROOT}

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    build-essential \
    pkg-config \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create and activate virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Create PyPSA directories
RUN mkdir -p ${XDG_DATA_HOME} && \
    chmod 777 ${XDG_DATA_HOME}

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir awslambdaric

# Copy function code
COPY ./gridsim_backend ${LAMBDA_TASK_ROOT}/gridsim_backend

# Set the CMD to your handler
CMD [ "python3", "-m", "awslambdaric", "gridsim_backend.app.main.handler" ]