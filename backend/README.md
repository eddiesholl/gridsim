# GridSim Backend

This is the backend API for the GridSim application, built with FastAPI and deployed to AWS Lambda.

## Setup

1. Install uv if you haven't already:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

2. Create and activate virtual environment:

```bash
uv venv
source .venv/bin/activate  # On Unix/macOS
# or
.venv\Scripts\activate  # On Windows
```

3. Install dependencies:

```bash
uv pip install -e .
```

## Development

Run the development server:

```bash
uvicorn gridsim_backend.app.main:app --reload
```

The API will be available at http://localhost:8000

## API Documentation

Once the server is running, you can access:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Deployment

This application is designed to be deployed to AWS Lambda using the CDK infrastructure code in the `infrastructure` directory.
