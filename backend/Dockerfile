# FROM osgeo/gdal:alpine-normal-3.6.3
FROM ghcr.io/osgeo/gdal:ubuntu-small-latest

# Set Lambda environment variables
ENV LAMBDA_TASK_ROOT=/var/task
ENV NETCDF4_DIR=/usr
ENV PKG_CONFIG_PATH="/usr/lib/pkgconfig:/usr/local/lib/pkgconfig:${PKG_CONFIG_PATH}"

# Set working directory
WORKDIR ${LAMBDA_TASK_ROOT}

# Install system dependencies and Python packages
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    build-essential \
    pkg-config \
    python3-dev
# py3-setuptools \
# py3-wheel
# hdf5-dev \
# netcdf-dev \
# geos-dev \
# geos

# RUN apk add --no-cache \
#     curl && \
#     apk add --upgrade curl curl-dev

# ENV RUSTUP_HOME=/usr/local/rustup \
#     CARGO_HOME=/usr/local/cargo \
#     PATH=/usr/local/cargo/bin:$PATH

# RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain 1.71.0


# Copy function code
# COPY ./gridsim_backend ${LAMBDA_TASK_ROOT}

# Install the function's dependencies using file requirements.txt
# from your project folder.
# COPY requirements.txt ${LAMBDA_TASK_ROOT}
# RUN pip3 install --no-cache-dir --timeout 100 -r requirements.txt --target "${LAMBDA_TASK_ROOT}"

RUN mkdir -p /.local && chmod 777 /.local
# RUN useradd -m -s /bin/bash appuser
# USER appuser

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "python3", "-m", "awslambdaric", "gridsim_backend.app.handler" ]