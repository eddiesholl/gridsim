from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from mangum import Mangum
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import numpy as np
import json
import hashlib
import pypsa

app = FastAPI(title="GridSim API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def create_plotly_figure(df: pd.DataFrame, plot_type: str = 'line', **kwargs) -> dict:
    """
    Create a Plotly figure from a DataFrame and return it as a dictionary.
    
    Args:
        df: pandas DataFrame
        plot_type: type of plot ('line', 'scatter', 'bar', etc.)
        **kwargs: additional arguments for the plot
    
    Returns:
        dict: Plotly figure as a dictionary
    """
    plot_functions = {
        'line': px.line,
        'scatter': px.scatter,
        'bar': px.bar,
        'area': px.area,
        # Add more plot types as needed
    }
    
    if plot_type not in plot_functions:
        raise ValueError(f"Unsupported plot type: {plot_type}")
    
    fig = plot_functions[plot_type](df, **kwargs)
    return fig.to_dict()

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


@app.get("/api/nem")
async def get_nem():
    # Read and parse the OpenNEM JSON file
    with open('../data/daily-summary.json', 'r') as f:
        daily_summary = json.load(f)
    
    # print(data)  # Let's see the structure of the first item
    

    # Create Plotly figure
    fig = go.Figure()

    x = daily_summary['x']
    for entry in daily_summary['entries']:
        name = entry['name']
        fig.add_trace(go.Scatter(
            x=x, y=entry['y'],
            hoverinfo='x+y',
            mode='lines',
            line=dict(width=0.5, color=getcolour_for(name)),
            stackgroup='one', # define stack group
            name=name
        ))
    
    # Update layout
    fig.update_layout(
        # yaxis_range=(0, 100),
        showlegend=True,
        title='NEM Generation Data',
        xaxis_title='Time',
        yaxis_title='Power (MW)',
        template='plotly_white',
        height=600,
        width=800
    )

    print(fig)
    
    # Convert to dict and return as JSONResponse
    return JSONResponse(content=fig.to_dict())

@app.get("/api/household")
async def get_household():
    # Create sample data
    dates = pd.date_range(start='2024-01-01', periods=24, freq='H')
    load = pd.Series([1.0] * 24, index=dates)
    pv = pd.Series([0.0] * 24, index=dates)
    pv[6:18] = 1.0  # Sun hours
    
    # Create DataFrame
    df = pd.DataFrame({
        'timestamp': dates,
        'load': load,
        'pv': pv
    })
    
    # Create Plotly figure
    fig = go.Figure()
    
    # Add traces
    fig.add_trace(go.Scatter(
        x=df['timestamp'].dt.strftime('%Y-%m-%d %H:%M:%S').tolist(),  # Convert timestamps to strings
        y=df['load'].tolist(),       # Convert to list
        name='Load',
        line=dict(color='blue')
    ))
    
    fig.add_trace(go.Scatter(
        x=df['timestamp'].dt.strftime('%Y-%m-%d %H:%M:%S').tolist(),  # Convert timestamps to strings
        y=df['pv'].tolist(),         # Convert to list
        name='PV',
        line=dict(color='orange')
    ))
    
    # Update layout
    fig.update_layout(
        title='Household Load and PV Generation',
        xaxis_title='Time',
        yaxis_title='Power (kW)',
        template='plotly_white'
    )
    
    # Convert to dict and return as JSONResponse
    return JSONResponse(content=fig.to_dict())

# Create handler for AWS Lambda
handler = Mangum(app) 