from gridsim_backend.app.types import DailyParameters, GeneratorMetadata, MarginalPrices
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

name_gas_cheap = "Gas (cheap)"
name_gas_moderate = "Gas (moderate)"
name_gas_expensive = "Gas (expensive)"
name_coal = "Coal"
name_solar = "Solar"

marginal_prices = MarginalPrices(
    gas_cheap=GeneratorMetadata(name=name_gas_cheap, marginal_cost=100.0),
    gas_moderate=GeneratorMetadata(name=name_gas_moderate, marginal_cost=150.0),
    gas_expensive=GeneratorMetadata(name=name_gas_expensive, marginal_cost=300.0),
    coal=GeneratorMetadata(name=name_coal, marginal_cost=80.0),
    solar=GeneratorMetadata(name=name_solar, marginal_cost=20.0)
)

def get_daily_network(params: DailyParameters):
    index = indices.single_day_hourly
    demand = pd.Series([
       21, 23,
        25, 26, 28, 29,
        28, 30, 29, 29,
        29, 28, 29, 27.5,
        24, 23, 23, 22,
        21, 21, 20, 20, 19,
        19, 21], index)

    solar_pv = pd.Series(
        [0] * 1 + [1] +
        [6] + [10] + [12] + [14] +
        [15] + [15] + [14] + [12] +
        [10] + [6] + [1] +
        [0] * 12,
        index
    )
    network = pypsa.Network()
    network.set_snapshots(index)

    network.add("Bus", "Grid", carrier="AC")

    network.add("Generator",
        name_gas_cheap,
        carrier="Gas",
        bus="Grid",
        p_nom_extendable=False,
        p_nom=8.0,
        p_max_pu=1.0,
        marginal_cost=marginal_prices.gas_cheap.marginal_cost)
    
    network.add("Generator",
        name_gas_moderate,
        carrier="Gas",
        bus="Grid",
        p_nom_extendable=False,
        p_nom=4.0,
        p_max_pu=1.0,
        marginal_cost=marginal_prices.gas_moderate.marginal_cost)
    
    network.add("Generator",
        name_gas_expensive,
        carrier="Gas",
        bus="Grid",
        p_nom_extendable=True,
        p_nom=2.0,
        p_max_pu=1.0,
        marginal_cost=marginal_prices.gas_expensive.marginal_cost)

    network.add("Generator",
        name_coal,
        carrier="Coal",
        bus="Grid",
        # p_nom_extendable=True,
        p_nom=16.0,
        p_max_pu=1.0,
        marginal_cost=marginal_prices.coal.marginal_cost)

    network.add("Generator",
        name_solar,
        bus="Grid",
        p_nom=1.0,
        p_max_pu=solar_pv,
        marginal_cost=marginal_prices.solar.marginal_cost)

    network.add("Load", "Grid demand", bus="Grid", p_set=demand)

    network.add("Bus", "Home", carrier="AC")

    network.add("Bus", "Battery", carrier="AC")

    network.add("Link", "Street", p_nom=1 * 100000, bus0="Grid", bus1="Home", p_min_pu=-1, p_max_pu=1)

    number_of_evs = params.number_of_evs
    hourly_load_per_ev = params.hourly_load_per_ev
    ev_battery_size_mwh = params.ev_battery_size_mwh
    initial_battery_soc = params.initial_battery_soc
    home_charger_p_nom_kw = params.home_charger_p_nom_kw
    max_discharge_factor = params.max_discharge_factor
    evening_recharge_time = params.evening_recharge_time
    actual_max_discharge_factor = max_discharge_factor * (params.percent_of_evs_in_vpp)

    # define the load that driving EVs draw from their batteries
    bev_load = hourly_load_per_ev * number_of_evs
    bev_usage = pd.Series([0.0] * 1 + [bev_load] * 2 + [0.0] * 7 + [bev_load] * 2 + [0.0] * 13, index)
    network.add("Load", "EV driving", bus="Battery", p_set=bev_usage)


    total_ev_capacity_mwh = number_of_evs * ev_battery_size_mwh
    initial_ev_storage = total_ev_capacity_mwh * initial_battery_soc

    # define the times that the home charger is able to charge and discharge the battery
    g2v_p_max_pu = pd.Series([1.0] * 1 + [0.0] * 2 + [0.0] * 7 + [0.0] * 2 + [1.0] * 13, index)
    v2g_p_max_pu = pd.Series([actual_max_discharge_factor] * 1 + [0.0] * 2 + [0.0] * 7 + [0.0] * 2 + [actual_max_discharge_factor] * 13, index)

    network.add(
        "Link",
        "grid to vehicle",
        bus0="Home",
        bus1="Battery",
        p_nom=home_charger_p_nom_kw * number_of_evs,
        p_max_pu=g2v_p_max_pu,
        p_min_pu=0,
        efficiency=0.95,
        # active=False
    )

    network.add(
        "Link",
        "vehicle to grid",
        bus0="Battery",
        bus1="Home",
        p_nom=home_charger_p_nom_kw * number_of_evs,
        p_max_pu=v2g_p_max_pu,
        p_min_pu=0,
        efficiency=0.95,
        marginal_cost=10.0,
        # active=False
    )

    # define the minimum state of charge of the battery through the day
    battery_e_min_pu = pd.Series([0.8] * 1 + [0.2] * 2 + [0.0] * 8 + [0.2] * 2 + [0.5] * 6 + [0.5] * 6, index)
    # battery_e_min_pu[24] = 1.0
    battery_e_min_pu[evening_recharge_time:] = 1.0

    # implement the actual battery storage
    network.add(
        "Store",
        "Batteries",
        bus="Battery",
        e_cyclic=False,
        e_initial=initial_ev_storage,
        e_nom=total_ev_capacity_mwh,
        e_min_pu=battery_e_min_pu)

    return network
