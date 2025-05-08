import pypsa
import pandas as pd
import numpy as np
from . import indices
from pydantic import BaseModel, Field   
from typing import Dict, List, Optional

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

class DailyParameters(BaseModel):
    number_of_evs: Optional[int] = Field(
        default=100,
        gt=0,
        le=200,
        description="Number of electric vehicles"
    )
    hourly_load_per_ev: Optional[float] = Field(
        default=0.007,
        gt=0,
        le=0.01,
        description="Hourly load per EV in MWh"
    )
    ev_battery_size_mwh: Optional[float] = Field(
        default=0.08,
        gt=0,
        le=0.1,
        description="EV battery size in MWh"
    )
    initial_battery_soc: Optional[float] = Field(
        default=0.8,
        ge=0,
        le=1,
        description="Initial battery state of charge (0-1)"
    )
    home_charger_p_nom_kw: Optional[float] = Field(
        default=0.022,
        gt=0,
        le=0.1,
        description="Home charger nominal power in kW"
    )
    max_discharge_factor: Optional[float] = Field(
        default=1,
        le=1,
        ge=0,
        description="Maximum discharge factor"
    )
    percent_of_evs_in_vpp: Optional[float] = Field(
        default=0.5,
        ge=0,
        le=1,
        description="Percentage of EVs in VPP"
    )

    class Config:
        from_attributes = True

def get_daily_network(params: DailyParameters):
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
        "Gas 1",
        carrier="Gas",
        bus="grid",
        p_nom_extendable=False,
        p_nom=2,
        p_max_pu=1,
        marginal_cost=100)
    
    network.add("Generator",
        "Gas 2",
        carrier="Gas",
        bus="grid",
        p_nom_extendable=False,
        p_nom=2,
        p_max_pu=1,
        marginal_cost=120)
    
    network.add("Generator",
        "Gas 3",
        carrier="Gas",
        bus="grid",
        p_nom_extendable=True,
        p_nom=2,
        p_max_pu=1,
        marginal_cost=150)

    network.add("Generator",
        "Coal",
        carrier="Coal",
        bus="grid",
        # p_nom_extendable=True,
        p_nom=16,
        p_max_pu=1,
        marginal_cost=80)

    network.add("Generator", "PV", bus="grid", p_nom=1, p_max_pu=solar_pv, marginal_cost=20)

    network.add("Load", "demand", bus="grid", p_set=demand)

    network.add("Bus", "home", carrier="AC")

    network.add("Bus", "battery", carrier="AC")

    network.add("Link", "street", p_nom=1 * 100000, bus0="grid", bus1="home", p_min_pu=-1, p_max_pu=1)

    number_of_evs = params.number_of_evs
    hourly_load_per_ev = params.hourly_load_per_ev
    ev_battery_size_mwh = params.ev_battery_size_mwh
    initial_battery_soc = params.initial_battery_soc
    home_charger_p_nom_kw = params.home_charger_p_nom_kw
    max_discharge_factor = params.max_discharge_factor
    actual_max_discharge_factor = max_discharge_factor * (params.percent_of_evs_in_vpp)

    # define the load that driving EVs draw from their batteries
    bev_load = hourly_load_per_ev * number_of_evs
    bev_usage = pd.Series([0.0] * 7 + [bev_load] * 2 + [0.0] * 7 + [bev_load] * 2 + [0.0] * 6, index)
    network.add("Load", "driving", bus="battery", p_set=bev_usage)


    total_ev_capacity_mwh = number_of_evs * ev_battery_size_mwh
    initial_ev_storage = total_ev_capacity_mwh * initial_battery_soc

    # define the times that the home charger is able to charge and discharge the battery
    g2v_p_max_pu = pd.Series([1.0] * 7 + [0.0] * 2 + [0.0] * 7 + [0.0] * 2 + [1.0] * 6, index)
    v2g_p_max_pu = pd.Series([actual_max_discharge_factor] * 7 + [0.0] * 2 + [0.0] * 7 + [0.0] * 2 + [actual_max_discharge_factor] * 6, index)

    network.add(
        "Link",
        "grid to vehicle",
        bus0="home",
        bus1="battery",
        p_nom=home_charger_p_nom_kw * number_of_evs,
        p_max_pu=g2v_p_max_pu,
        p_min_pu=0,
        efficiency=1
    )

    network.add(
        "Link",
        "vehicle to grid",
        bus0="battery",
        bus1="home",
        p_nom=home_charger_p_nom_kw * number_of_evs,
        p_max_pu=v2g_p_max_pu,
        p_min_pu=0,
        efficiency=1,
        marginal_cost=10
    )

    # define the minimum state of charge of the battery through the day
    battery_e_min_pu = pd.Series([0] * 6 + [0.8] * 1 + [0.2] * 2 + [0.0] * 8 + [0.2] * 2 + [0.2] * 4 + [0.8], index)

    # implement the actual battery storage
    network.add(
        "Store",
        "battery storage",
        bus="battery",
        e_cyclic=False,
        e_initial=initial_ev_storage,
        e_nom=total_ev_capacity_mwh,
        e_min_pu=battery_e_min_pu)

    return network
