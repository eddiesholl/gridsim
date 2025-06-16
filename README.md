# GridSim

Welcome to GridSim, an open source project to help understand the operation and challenges of a modern elctricity grid. The project has kicked off as a personal project to help learn grid modelling concepts, while exploring emerging concepts like Vehicle to Grid, temporal shifting and distributed energy resources. I'm hoping to engage in transparent learning, so others can benefit as I build out my own knowledge. That explains why the app itself is open source, and is presented as a public website.

The core concept of the app is to optimise an electricity grid to satisfy different configurations and constraints. This is all implemented using [PyPSA](https://pypsa.readthedocs.io/en/latest/). The front end is responsible for helping to explain the purpose of each scenario or option, benefits and tradeoffs, and to guide the user in building their understanding.

# Getting involved

If you're interested in raising a suggestion or reporting an issue, feel free to open an issue or start a discussion here.

## Roadmap

You can review upcoming features, enhancements and fixes on the [project page](https://github.com/users/eddiesholl/projects/2).

# Technology

The app is a full-stack application with a python FastAPI backend and React frontend, deployed to AWS using CDK. The core element of the app is running optimisation of an electricity grid model using PyPSA. This is then presented in a way that is easy to navigate and understand via the React front end.

To help keep the front end more strongly typed via TypeScript, we can import types from the backend API using `npm run generate-api-types`. There are types defined on the backend using `pydantic` and `typing`. The built in `FastAPI` support for `OpenAPI` makes it easy to expose types for the REST API responses, which can then be extracted to generate TypeScript types.

The npm package `openapi-typescript-fetch` is in use to create a strongly typed client on top of the extracted types, giving us fully typed REST API responses.

Chart rendering is handled by [plotly](https://plotly.com/javascript/react/) via `react-plotly.js`.

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
   uvicorn gridsim_backend.app.main:app  --reload
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

### Accessing the dev server from an external device

You might want to try out the mobile or tablet with real hardware, running against a local dev server. You can achieve this with:

- `VITE_API_URL=http://192.168.0.1:8000 p dev` - where the IP address is how your device will access the machine with the dev server
- `ALLOW_ORIGINS=* uvicorn gridsim_backend.app.main:app --reload --host 0.0.0.0 --port 8000`

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
