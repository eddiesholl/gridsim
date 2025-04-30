from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from mangum import Mangum
from . import network

app = FastAPI(title="GridSim API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://gridsim.eddit.io"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to GridSim API"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/primitive")
async def get_primitive():
    nw = network.get_primitive_network()
    nw.optimize()

    # Convert timestamps to strings for JSON serialization
    timestamps = nw.generators_t.p.index.strftime('%Y-%m-%d %H:%M:%S').tolist()
    
    # Convert generator data to a format that can be serialized
    generator_data = {}
    for gen in ['Gas', 'Coal', 'PV']:
        # Convert the series to a list of values
        for d in ['p']:
            if generator_data.get(d) is None:
                generator_data[d] = {}
            generator_data[d][gen] = nw.generators_t[d][gen].tolist()

    load_data = {}
    for load in ['demand', 'driving']:
        for d in ['p']:
            if load_data.get(d) is None:
                load_data[d] = {}
            load_data[d][load] = nw.loads_t[d][load].tolist()

    store_data = {}
    for store in ['battery storage']:
        for d in ['p', 'e']:
            if store_data.get(d) is None:
                store_data[d] = {}
            store_data[d][store] = nw.stores_t[d][store].tolist()

    # print(dir(nw.loads_t.p))
    print(nw.loads_t.p.columns)
    result = {
        'index': timestamps,
        'generators': generator_data,
        'loads': load_data,
        'stores': store_data
    }
    print(result)
        
    return JSONResponse(content=result)

# Create handler for AWS Lambda
handler = Mangum(app) 