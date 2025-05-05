from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from mangum import Mangum
from . import network
from pydantic import BaseModel
from typing import Dict, List, Optional
from datetime import datetime

app = FastAPI(title="GridSim API",
              version="0.1.0",
              openapi_url="/openapi.json",
              docs_url="/docs",
              redoc_url="/redoc")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://gridsim.eddit.io"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define response models
class GeneratorData(BaseModel):
    p: Dict[str, List[float]]

class LoadData(BaseModel):
    p: Dict[str, List[float]]

class StoreData(BaseModel):
    p: Dict[str, List[float]]
    e: Dict[str, List[float]]

class PrimitiveResponse(BaseModel):
    index: List[str]  # datetime strings
    generators: GeneratorData
    loads: LoadData
    stores: StoreData

@app.get("/")
async def root():
    return {"message": "Welcome to GridSim API"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/primitive", response_model=PrimitiveResponse)
async def get_primitive():
    nw = network.get_primitive_network()
    status, message = nw.optimize()
    
    if status == 'warning' and message == 'infeasible':
        raise HTTPException(status_code=400, detail="Optimization problem is infeasible")
    
    # Debug: Print available generator names
    print("Available generators:", nw.generators_t.p.columns.tolist())

    # Convert timestamps to strings for JSON serialization
    timestamps = nw.generators_t.p.index.strftime('%Y-%m-%d %H:%M:%S').tolist()
    
    # Convert generator data to a format that can be serialized
    generator_data = {
        'p': {
            gen: nw.generators_t['p'][gen].tolist()
            for gen in nw.generators_t.p.columns  # Use actual column names instead of hardcoded list
        }
    }

    load_data = {
        'p': {
            load: nw.loads_t['p'][load].tolist()
            for load in nw.loads_t.p.columns  # Use actual column names
        }
    }

    store_data = {
        'p': {store: nw.stores_t['p'][store].tolist() for store in nw.stores_t.p.columns},
        'e': {store: nw.stores_t['e'][store].tolist() for store in nw.stores_t.e.columns}
    }

    return PrimitiveResponse(
        index=timestamps,
        generators=GeneratorData(**generator_data),
        loads=LoadData(**load_data),
        stores=StoreData(**store_data)
    )

# Create handler for AWS Lambda
handler = Mangum(app) 