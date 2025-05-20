from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from gridsim_backend.app.types import BusData, DailyResponse, GeneratorData, LinkData, LoadData, MarginalPrices, SingleGeneratorData, StoreData
from mangum import Mangum
from . import network
from pydantic import BaseModel

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


class RootResponse(BaseModel):
    message: str

class HealthResponse(BaseModel):
    status: str



@app.get("/", response_model=RootResponse)
async def root():
    return {"message": "Welcome to GridSim API"}

@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    return {"status": "healthy"}

@app.get("/api/daily", response_model=DailyResponse)
async def get_daily(params: network.DailyParameters = Depends()):
    nw = network.get_daily_network(params)
    status, message = nw.optimize()

    # print(status)
    # print(message)
    # print(nw.objective)
    # print(nw.generators.carrier['Gas 1'])
    
    if status == 'warning' and message == 'infeasible':
        print("Optimization problem is infeasible")
        raise HTTPException(status_code=400, detail="Optimization problem is infeasible")
    
    # Debug: Print available generator names
    # print("Available links:", nw.links_t.p0)
    # print("Available buses:", nw.buses_t.p)

    # Convert timestamps to strings for JSON serialization
    timestamps = nw.generators_t.p.index.strftime('%Y-%m-%d %H:%M:%S').tolist()
    
    # Convert generator data to a format that can be serialized
    generator_data = {
        'generators': {
            gen: SingleGeneratorData(
                p=nw.generators_t['p'][gen].tolist(),
                carrier=nw.generators.carrier[gen]
            )
            for gen in nw.generators_t.p.columns
        }
    }

    load_data = {
        'p': {
            load: nw.loads_t['p'][load].tolist()
            for load in nw.loads_t.p.columns
        }
    }

    store_data = {
        'p': {store: nw.stores_t['p'][store].tolist() for store in nw.stores_t.p.columns},
        'e': {store: nw.stores_t['e'][store].tolist() for store in nw.stores_t.e.columns},
        'e_min_pu': {store: nw.stores_t['e_min_pu'][store].tolist() for store in nw.stores_t.e_min_pu.columns}
    }

    link_data = {
        'p0': {link: nw.links_t['p0'][link].tolist() for link in nw.links_t.p0.columns},
        'p1': {link: nw.links_t['p1'][link].tolist() for link in nw.links_t.p1.columns}
    }

    bus_data = {
        'p': {bus: nw.buses_t['p'][bus].tolist() for bus in nw.buses_t.p.columns},
        'marginal_price': {bus: nw.buses_t['marginal_price'][bus].tolist() for bus in nw.buses_t.marginal_price.columns}
    }

    return DailyResponse(
        index=timestamps,
        generators=GeneratorData(**generator_data),
        loads=LoadData(**load_data),
        stores=StoreData(**store_data),
        links=LinkData(**link_data),
        buses=BusData(**bus_data),
        params=params,
        marginal_prices=network.marginal_prices
    )

# Create handler for AWS Lambda
handler = Mangum(app) 