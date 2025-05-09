import { Button, Card, LoadingOverlay, Text } from "@mantine/core";
import { Data, Layout } from "plotly.js";
import { useState } from "react";
import Plot from "react-plotly.js";
import { getPrimitive } from "../../services/api";
import { chartColorArray } from "../../styles/colors";
import "./App.css";

type PlotlyData = {
  data: Data[];
  layout: Layout;
};

type LoadState = "initial" | "loading" | "error" | "success";

export function IndexPage() {
  const [loadState, setLoadState] = useState<LoadState>("initial");
  const [error, setError] = useState<string>("");
  const [primitiveData, setPrimitiveData] = useState<PlotlyData | null>(null);

  const getPrimitiveData = async () => {
    try {
      setLoadState("loading");
      const { data } = await getPrimitive(undefined);
      // Transform the data into plotly format
      const plotData = {
        data: Object.entries(data.generators.p)
          .concat(Object.entries(data.loads.p))
          .concat(
            Object.entries(data.stores.e).map(([name, values]) => [
              `${name} (mwh stored)`,
              values,
            ])
          )
          .concat(
            Object.entries(data.stores.p).map(([name, values]) => [
              `${name} (output)`,
              values,
            ])
          )
          .map(([name, values], index) => ({
            type: "scatter",
            mode: "lines",
            name: name,
            x: data.index,
            y: values,
            line: {
              shape: "linear",
              color: chartColorArray[index % chartColorArray.length], // colorPalette[index % colorPalette.length],
              width: 3,
            },
          })),
        layout: {
          title: {
            text: "Daily Load Profile",
            font: {
              family: "Roboto, sans-serif",
              size: 24,
              color: "var(--mantine-color-dark-9)",
            },
          },
          font: {
            family: "Roboto, sans-serif",
            size: 14,
            color: "var(--mantine-color-dark-9)",
          },
          xaxis: {
            title: {
              text: "Time",
              font: {
                family: "Roboto, sans-serif",
                size: 16,
                color: "var(--mantine-color-dark-9)",
              },
            },
            tickfont: {
              family: "Roboto, sans-serif",
              size: 12,
              color: "var(--mantine-color-dark-7)",
            },
          },
          yaxis: {
            title: {
              text: "Power (MW)",
              font: {
                family: "Roboto, sans-serif",
                size: 16,
                color: "var(--mantine-color-dark-9)",
              },
            },
            tickfont: {
              family: "Roboto, sans-serif",
              size: 12,
              color: "var(--mantine-color-dark-7)",
            },
          },
          legend: {
            font: {
              family: "Roboto, sans-serif",
              size: 12,
              color: "var(--mantine-color-dark-9)",
            },
          },
        },
      } as PlotlyData;
      setPrimitiveData(plotData);
      setLoadState("success");
    } catch {
      setLoadState("error");
      setError("Failed to get basic scenario");
    }
  };

  return (
    <div className="App">
      <div className="card">
        <Button loading={loadState === "loading"} onClick={getPrimitiveData}>
          Fetch basic scenario
        </Button>

        {error && <p className="error">{error}</p>}
      </div>

      <Card>
        {primitiveData ? (
          <Plot data={primitiveData.data} layout={primitiveData.layout} />
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
