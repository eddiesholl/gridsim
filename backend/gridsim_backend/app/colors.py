import hashlib

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