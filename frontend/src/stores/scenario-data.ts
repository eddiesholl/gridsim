import { create } from "zustand";
import {
  scenarioEvCharging,
  scenarioOriginalGrid,
  scenarioSmartCharging,
  scenarioV2G,
} from "../scenarios/daily";
import { getDailyQuery } from "../services/api";
import { DailyScenarioResult, Scenarios } from "../types";

type ScenarioState = Record<Scenarios, Promise<DailyScenarioResult> | null>;

type ScenarioStore = {
  scenarios: ScenarioState;
  addScenario: (
    scenario: Scenarios,
    data: Promise<DailyScenarioResult>
  ) => void;
  reset: () => void;
  ensureScenarios: () => void;
};

const initialState: ScenarioState = {
  intro: null,
  "ev-charging": null,
  "smart-charging": null,
  v2g: null,
};

export const useScenarioData = create<ScenarioStore>()((set) => ({
  scenarios: initialState,
  addScenario: (scenario: Scenarios, data: Promise<DailyScenarioResult>) =>
    set((state) => ({ ...state, [scenario]: data })),
  ensureScenarios: () => {
    set((state) => {
      if (!state.scenarios["intro"]) {
        return {
          ...state,
          scenarios: {
            ...state.scenarios,
            ["intro"]: getDailyQuery(scenarioOriginalGrid),
            ["ev-charging"]: getDailyQuery(scenarioEvCharging),
            ["smart-charging"]: getDailyQuery(scenarioSmartCharging),
            ["v2g"]: getDailyQuery(scenarioV2G),
          },
        };
      }
      return state;
    });
  },
  fetchScenarios: () => {
    set((state) => ({
      ...state,
      intro: getDailyQuery(scenarioOriginalGrid),
    }));
  },
  reset: () => set((state) => ({ ...state, ...initialState })),
}));
