import { Button, Card, Flex, LoadingOverlay, Text } from "@mantine/core";
import { useState } from "react";
import Plot from "react-plotly.js";
import {
  plotBatterySocData,
  plotDailyLinkData,
  plotDailyLoadData,
  plotDailyMarginalPriceData,
} from "../../data/plotly";
import { averageMarginalPrice, sumGasUsage } from "../../data/results";
import { getDailyQuery } from "../../services/api";
import { DailyResponse } from "../../types";
import "./App.css";
type LoadState = "initial" | "loading" | "error" | "success";

type GetDailyParams = Parameters<typeof getDailyQuery>;

export function IndexPage() {
  const [loadState, setLoadState] = useState<LoadState>("initial");
  const [error, setError] = useState<string>("");
  const [dailyResponse, setDailyResponse] = useState<DailyResponse | null>(
    null
  );
  const getDailyData = async (...getDailyParams: GetDailyParams) => {
    try {
      setLoadState("loading");
      const { data } = await getDailyQuery(...getDailyParams);
      // Transform the data into plotly format
      setDailyResponse(data);
      setError("");
      setLoadState("success");
    } catch {
      setLoadState("error");
      setError("Failed to get daily scenario");
    }
  };

  const dailyLoadData = dailyResponse ? plotDailyLoadData(dailyResponse) : null;
  const dailyLinkData = dailyResponse ? plotDailyLinkData(dailyResponse) : null;
  const dailyMarginalPriceData = dailyResponse
    ? plotDailyMarginalPriceData(dailyResponse)
    : null;
  const totalGasUsage = dailyResponse ? sumGasUsage(dailyResponse) : null;
  const avgMarginalPrice = dailyResponse
    ? averageMarginalPrice(dailyResponse)
    : null;
  const batterySocData = dailyResponse
    ? plotBatterySocData(dailyResponse)
    : null;

  return (
    <div className="App">
      <div className="card">
        <Flex justify="center" gap="md">
          <Button
            loading={loadState === "loading"}
            onClick={() => getDailyData({ percent_of_evs_in_vpp: 0 })}
          >
            Fetch daily scenario (no VPP)
          </Button>

          <Button
            loading={loadState === "loading"}
            onClick={() => getDailyData({ percent_of_evs_in_vpp: 1 })}
          >
            Fetch daily scenario (all VPP)
          </Button>

          {error && <p className="error">{error}</p>}
        </Flex>
      </div>

      <Card>
        {dailyLoadData &&
        dailyLinkData &&
        dailyMarginalPriceData &&
        batterySocData ? (
          <>
            <Plot data={dailyLoadData.data} layout={dailyLoadData.layout} />
            <Plot data={batterySocData.data} layout={batterySocData.layout} />
            <Plot data={dailyLinkData.data} layout={dailyLinkData.layout} />
            <Plot
              data={dailyMarginalPriceData.data}
              layout={dailyMarginalPriceData.layout}
            />
            <Card>
              <Text>Total gas usage: {totalGasUsage}</Text>
            </Card>
            <Card>
              <Text>Average marginal price: {avgMarginalPrice}</Text>
            </Card>
          </>
        ) : (
          <Text fs="italic">Your simulation results will appear here...</Text>
        )}
        <LoadingOverlay
          visible={loadState === "loading"}
          transitionProps={{ transition: "fade", duration: 500 }}
        />
      </Card>
    </div>
  );
}
