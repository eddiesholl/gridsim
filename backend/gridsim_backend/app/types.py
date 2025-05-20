from pydantic import BaseModel, Field   
from typing import Dict, List, Optional

class DailyParameters(BaseModel):
    number_of_evs: Optional[int] = Field(
        default=200,
        gte=0,
        le=400,
        description="Number of electric vehicles"
    )
    hourly_load_per_ev: Optional[float] = Field(
        default=0.005,
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
        default=1,
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
    evening_recharge_time: Optional[int] = Field(
        default=24,
        ge=12,
        le=24,
        description="Hour in the evening to complete evening charging (18-24)"
    )

    class Config:
        from_attributes = True

class SingleGeneratorData(BaseModel):
    p: List[float]
    carrier: str

class GeneratorData(BaseModel):
    generators: Dict[str, SingleGeneratorData]
class LoadData(BaseModel):
    p: Dict[str, List[float]]

class StoreData(BaseModel):
    p: Dict[str, List[float]]
    e: Dict[str, List[float]]
    e_min_pu: Dict[str, List[float]]
class LinkData(BaseModel):
    p0: Dict[str, List[float]]
    p1: Dict[str, List[float]]

class BusData(BaseModel):
    p: Dict[str, List[float]]
    marginal_price: Dict[str, List[float]]

class GeneratorMetadata(BaseModel):
    name: str
    marginal_cost: float

class MarginalPrices(BaseModel):
    gas_cheap: GeneratorMetadata
    gas_moderate: GeneratorMetadata
    gas_expensive: GeneratorMetadata
    coal: GeneratorMetadata
    solar: GeneratorMetadata

class DailyResponse(BaseModel):
    index: List[str]  # datetime strings
    generators: GeneratorData
    loads: LoadData
    stores: StoreData
    links: LinkData
    buses: BusData
    params: DailyParameters
    marginal_prices: MarginalPrices