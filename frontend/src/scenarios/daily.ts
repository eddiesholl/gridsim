import { Comparison, DailyScenario } from "../types";

export const scenarioOriginalGrid: DailyScenario = {
  name: "Original Grid",
  parameters: {
    number_of_evs: 0,
  },
};

export const scenarioEvCharging: DailyScenario = {
  name: "EV Charging",
  parameters: {
    evening_recharge_time: 13,
  },
};

export const scenarioSmartCharging: DailyScenario = {
  name: "Smart Charging",
  parameters: {
    percent_of_evs_in_vpp: 0,
  },
};

export const scenarioV2G: DailyScenario = {
  name: "V2G",
  parameters: {
    percent_of_evs_in_vpp: 0.5,
  },
};

export const compareEvCharging: Comparison = {
  before: scenarioOriginalGrid,
  after: scenarioEvCharging,
};

export const compareSmartCharging: Comparison = {
  before: scenarioEvCharging,
  after: scenarioSmartCharging,
};

export const compareV2G: Comparison = {
  before: scenarioSmartCharging,
  after: scenarioV2G,
};
