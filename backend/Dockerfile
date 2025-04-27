# FROM osgeo/gdal:alpine-normal-3.6.3
FROM ghcr.io/osgeo/gdal:ubuntu-small-latest

# Set Lambda environment variables
ENV LAMBDA_TASK_ROOT=/var/task
ENV NETCDF4_DIR=/usr
ENV PKG_CONFIG_PATH="/usr/lib/pkgconfig:/usr/local/lib/pkgconfig:${PKG_CONFIG_PATH}"

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

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy function code
COPY ./gridsim_backend ${LAMBDA_TASK_ROOT}/gridsim_backend

# Set the CMD to your handler
CMD [ "python3", "-m", "awslambdaric", "gridsim_backend.app.main.handler" ]