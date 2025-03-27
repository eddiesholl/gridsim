# GridSim

A full-stack application with FastAPI backend and React frontend, deployed to AWS using CDK.

## Project Structure

```
gridsim/
├── backend/           # FastAPI backend application
├── frontend/         # React + TypeScript frontend application
└── infrastructure/   # AWS CDK infrastructure code
```

## Prerequisites

- Python 3.9+
- Node.js 18+
- AWS CLI configured with appropriate credentials
- AWS CDK CLI installed (`npm install -g aws-cdk`)

## Setup

### Backend

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install uv if you haven't already:

   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```

3. Create and activate virtual environment:

   ```bash
   uv venv
   source .venv/bin/activate  # On Unix/macOS
   # or
   .venv\Scripts\activate  # On Windows
   ```

4. Install dependencies:

   ```bash
   uv pip install -e .
   ```

5. Run the development server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

### Infrastructure

1. Navigate to the infrastructure directory:

   ```bash
   cd infrastructure
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Deploy the infrastructure:
   ```bash
   npm run deploy
   ```

## Development

- Backend API runs on http://localhost:8000
- Frontend development server runs on http://localhost:5173
- API documentation available at http://localhost:8000/docs

## Deployment

The application is designed to be deployed to AWS:

- Backend runs as a Lambda function behind API Gateway
- Frontend is served from an S3 bucket through CloudFront

To deploy:

1. Build the frontend:

   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the infrastructure:
   ```bash
   cd infrastructure
   npm run deploy
   ```

The deployment will output the frontend and API URLs.
