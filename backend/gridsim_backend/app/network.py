import pypsa
import pandas as pd
import numpy as np
def get_single_node_network():
    """
    Creates and returns a simple single-node network using PyPSA.
    
    Returns:
        pypsa.Network: A PyPSA network object with a single node
    """
    # Create hourly index first (timezone-naive)
    hourly_index = pd.date_range("2025-03-01 00:00", "2025-03-01 23:00", freq="h")
    five_minute_index = pd.date_range("2025-03-01 00:00", "2025-03-01 23:55", freq="5min")
    
    # Create hourly data
    bev_usage = pd.Series([0.0] * 7 * 12 + [9.0] * 2 * 12 + [0.0] * 8 * 12 + [9.0] * 2 * 12 + [0.0] * 5 * 12, five_minute_index)
    
    # Resample to 5-minute intervals and forward fill
    # bev_usage = hourly_usage.resample("5min").ffill()


    work_charger_p_max_pu = pd.Series(0, five_minute_index)
    work_charger_p_max_pu["2025-03-01 09:00":"2025-03-01 17:00"] = 0.5

    home_charger_p_max_pu = pd.Series(0.8, five_minute_index)
    home_charger_p_max_pu["2025-03-01 09:00":"2025-03-01 17:00"] = 0.2
    
    # Create a new network
    network = pypsa.Network()
    
    # Set the network's snapshots to match our time series data
    network.set_snapshots(five_minute_index)
    
    # Create marginal price directly with 5-minute index
    marginal_grid_cost = pd.Series(
        [70.0] * 72 + # 0 - 6am (6 hours * 12 5-min intervals)
        [120.0] * 24 + # 6 - 8am (2 hours * 12 5-min intervals)
        [30.0] * 24 + # 8 - 10am (2 hours * 12 5-min intervals)
        [15.0] * 60 + # 10 - 3pm (5 hours * 12 5-min intervals)
        [40.0] * 12 + # 3 - 4pm (1 hour * 12 5-min intervals)
        [80.0] * 12 + # 4 - 5pm (1 hour * 12 5-min intervals)
        [100.0] * 12 + # 5 - 6pm (1 hour * 12 5-min intervals)
        [120.0] * 12 + # 6 - 7pm (1 hour * 12 5-min intervals)
        [110.0] * 12 + # 7 - 8pm (1 hour * 12 5-min intervals)
        [95.0] * 24 + # 8 - 10pm (2 hours * 12 5-min intervals)
        [75.0] * 24 # 10 - 12pm (2 hours * 12 5-min intervals)
        , five_minute_index)
    
    network.add("Bus", "place of work", carrier="AC", v_nom=240)
    network.add("Bus", "home", carrier="AC", v_nom=240)

    network.add("Bus", "grid", carrier="AC")
    network.add("Generator", "grid", bus="grid", marginal_cost=marginal_grid_cost, carrier="AC", p_nom=1000)
    network.add("Line", "grid_place_of_work", bus0="grid", bus1="place of work", x=0.1, s_nom=1000)
    network.add("Line", "grid_home", bus0="grid", bus1="home", x=0.1, s_nom=1000)

    # network.add("Bus", "home", carrier="AC", v_nom=240)

    network.add("Bus", "battery", carrier="Li-ion")

    # network.add("Load", "driving", bus="battery")
    network.add("Load", "driving", bus="battery", p_set=bev_usage)

    network.add(
        "Link",
        "work charger",
        bus0="place of work",
        bus1="battery",
        p_nom=22,
        p_max_pu=work_charger_p_max_pu,
        efficiency=0.9,
    )

    network.add(
        "Link",
        "home charger",
        bus0="home",
        bus1="battery",
        p_nom=22,
        p_max_pu=home_charger_p_max_pu,
        efficiency=0.9,
    )

    battery_state_of_charge = pd.Series(
        [np.nan] * 7 * 12 +
        [0.8] + [np.nan] * 11 +
        [np.nan] * 16 * 12,
        five_minute_index)

    network.add("Store", "battery storage", bus="battery", e_cyclic=False, e_nom=100.0, state_of_charge_set=battery_state_of_charge)

    
    
    
    
    return network 