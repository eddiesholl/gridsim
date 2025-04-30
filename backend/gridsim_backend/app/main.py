from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from mangum import Mangum
import pandas as pd
from datetime import datetime, timedelta
import numpy as np
import json
import hashlib
import pypsa
from . import network

app = FastAPI(title="GridSim API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://gridsim.eddit.io"],  # Vite's default port
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

# function that converts a string to a list of 3 numbers, each one between 0 and 255
# the numbers should distributed widely through the possible space of numbers
def generate_colors(seed: str) -> tuple[int, int, int]:
    """
    Generate three random numbers between 0 and 255 from a string seed.
    Uses SHA-256 hash to ensure good distribution of values.
    
    Args:
        seed: String to use as seed
        
    Returns:
        Tuple of three integers between 0 and 255
    """
    # Create SHA-256 hash of the seed
    hash_obj = hashlib.sha256(seed.encode())
    hash_hex = hash_obj.hexdigest()
    
    # Take three 8-character chunks and convert to integers
    # Each chunk will be 32 bits, we'll use the first 8 bits (0-255)
    r = int(hash_hex[0:8], 16) % 256
    g = int(hash_hex[8:16], 16) % 256
    b = int(hash_hex[16:24], 16) % 256
    
    return (r, g, b)

def getcolour_for(name: str) -> str:
    colours = {
        'battery_charging': 'rgb(200, 200, 200)',
        'battery_discharging': 'rgb(250, 250, 250)',
        'bioenergy': 'rgb(60, 125, 40)',
        'coal': 'rgb(10, 10, 10)',
        'distillate': 'rgb(50, 10, 10)',
        'gas': 'rgb(200, 40, 40)',
        'hydro': 'rgb(10, 10, 201)',
        'pumps': 'rgb(50, 50, 251)',
        'solar': 'rgb(255, 255, 0)',
        'wind': 'rgb(200, 200, 20)',
    }
    # convert name string to an integer
    if name in colours:
        return colours[name]
    else:
        rgb = generate_colors(name)
        print(rgb)
        return f'rgb({rgb[0]}, {rgb[1]}, {rgb[2]})'

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