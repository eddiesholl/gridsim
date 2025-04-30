import pypsa
import pandas as pd
import numpy as np
from . import indices

def get_single_node_network():
    """
    Creates and returns a simple single-node network using PyPSA.
    
    Returns:
        pypsa.Network: A PyPSA network object with a single node
    """
    # Create hourly index first (timezone-naive)
    hourly_index = pd.date_range("2025-03-01 00:00", "2025-03-01 23:00", freq="h")
    five_minute_index = pd.date_range("2025-03-01 00:00", "2025-03-01 23:55", freq="5min")

    number_of_bevs = 1
    bev_capacity_mwh = 0.1
    total_bev_capacity = number_of_bevs * bev_capacity_mwh
    
    # Create hourly data
    bev_usage = pd.Series([0.0] * 7 * 12 + [9.0 / 1000] * 2 * 12 + [0.0] * 8 * 12 + [9.0 / 1000] * 2 * 12 + [0.0] * 5 * 12, five_minute_index)

    work_charger_p_max_pu = pd.Series(0, five_minute_index)
    work_charger_p_max_pu["2025-03-01 09:00":"2025-03-01 17:00"] = 0.5

    home_charger_p_max_pu = pd.Series(0.8, five_minute_index)
    home_charger_p_max_pu["2025-03-01 17:00":"2025-03-01 23:55"] = 0.2
    
    # Create a new network
    network = pypsa.Network()
    
    # Set the network's snapshots to match our time series data
    network.set_snapshots(five_minute_index)

    network.add("Carrier", "AC")
    
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
    network.add("Line", "grid_place_of_work", bus0="grid", bus1="place of work", x=0.1, s_nom=1000, carrier="AC")
    network.add("Line", "grid_home", bus0="grid", bus1="home", x=0.1, s_nom=1000, carrier="AC")

    # network.add("Bus", "home", carrier="AC", v_nom=240)

    network.add("Bus", "battery", carrier="AC")

    # network.add("Load", "driving", bus="battery")
    network.add("Load", "driving", bus="battery", p_set=bev_usage)

    network.add(
        "Link",
        "work charger",
        bus0="place of work",
        bus1="battery",
        p_nom=(11 * number_of_bevs) / 1000,
        p_max_pu=work_charger_p_max_pu,
        efficiency=0.9,
    )

    network.add(
        "Link",
        "home charger",
        bus0="home",
        bus1="battery",
        p_nom=(11 * number_of_bevs) / 1000,
        p_max_pu=home_charger_p_max_pu,
        efficiency=0.9,
    )

    morning_charge_goal = 0 # 0.8
    battery_state_of_charge = pd.Series(
        [np.nan] * 7 * 12 + # 0 - 6am
        [morning_charge_goal] + [np.nan] * 11 + # 6 - 7am
        [np.nan] * 16 * 12, # 7 - 12pm
        five_minute_index)

    network.add("StorageUnit", "battery storage", bus="battery",
                state_of_charge_initial=total_bev_capacity * 0.5, cyclic_state_of_charge=False, p_nom=total_bev_capacity, max_hours=1,
                )

    
    
    
    
    return network

def get_primitive_network():
    index = indices.single_day_hourly
    demand = pd.Series([
        21, 20, 20, 19,
        19, 20, 21, 23,
        25, 26, 28, 29,
        29, 29, 29, 29,
        29, 28, 27, 26,
        25, 24, 23, 22
        ], index)

    solar_pv = pd.Series(
        [0] * 7 + [1] +
        [6] + [10] + [12] + [14] +
        [15] + [15] + [14] + [12] +
        [10] + [6] + [1] +
        [0] * 5,
        index
    )
    network = pypsa.Network()
    network.set_snapshots(index)

    network.add("Bus", "grid", carrier="AC")
    network.add("Generator",
        "Gas",
        bus="grid",
        p_nom_extendable=True,
        p_max_pu=40,
        marginal_cost=120)

    network.add("Generator",
        "Coal",
        bus="grid",
        # p_nom_extendable=True,
        p_nom=1,
        p_max_pu=15,
        marginal_cost=80)

    network.add("Generator", "PV", bus="grid", p_nom=1, p_max_pu=solar_pv, marginal_cost=20)

    network.add("Load", "demand", bus="grid", p_set=demand)

    network.add("Bus", "home", carrier="AC")

    network.add("Bus", "battery", carrier="AC")

    network.add("Link", "street", p_nom=1, bus0="grid", bus1="home", p_min_pu=-1, p_max_pu=1)

    bev_hourly_load = 0.009
    bev_usage = pd.Series([0.0] * 7 + [bev_hourly_load] * 2 + [0.0] * 8 + [bev_hourly_load] * 2 + [0.0] * 5, index)
    network.add("Load", "driving", bus="battery", p_set=bev_usage)

    charger_p_max_pu = pd.Series([1.0] * 7 + [0.0] * 2 + [0.0] * 8 + [0.0] * 2 + [1.0] * 5, index)
    charger_p_min_pu = pd.Series([-1.0] * 7 + [0.0] * 2 + [0.0] * 8 + [0.0] * 2 + [-1.0] * 5, index)
    network.add(
        "Link",
        "charger",
        bus0="home",
        bus1="battery",
        p_nom=120,  # super-charger with 120 kW
        p_max_pu=charger_p_max_pu,
        p_min_pu=charger_p_min_pu,
        efficiency=0.9,
    )

    battery_e_min_pu = pd.Series([0] * 23 + [1], index)
    network.add("Store", "battery storage", bus="battery", e_cyclic=False, e_initial=0.1, e_nom=0.1, e_min_pu=battery_e_min_pu)

    return network
