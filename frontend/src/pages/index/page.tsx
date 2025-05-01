import { Data, Layout } from "plotly.js";
import { useState } from "react";
import Plot from "react-plotly.js";
import { getPrimitive, healthCheck } from "../../services/api";
import "./App.css";

type PlotlyData = {
  data: Data[];
  layout: Layout;
};

export function IndexPage() {
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [primitiveData, setPrimitiveData] = useState<PlotlyData | null>(null);
  const checkHealth = async () => {
    try {
      const response = await healthCheck();
      setStatus(response.status);
      setError("");
    } catch {
      setError("Failed to connect to API");
      setStatus("");
    }
  };

  const getPrimitiveData = async () => {
    try {
      const response = await getPrimitive();
      // Transform the data into plotly format
      const plotData = {
        data: Object.entries(
          response.generators.p
          // .concat(response.stores.e)
        )
          .concat(Object.entries(response.loads.p))
          .concat(Object.entries(response.stores.e))
          .map(([name, values]) => ({
            type: "scatter",
            mode: "lines",
            name: name,
            x: response.index,
            y: values,
            line: { shape: "linear" },
          })),
        layout: {
          title: "Generator Output Over Time",
          xaxis: {
            title: "Time",
          },
          yaxis: {
            title: "Power (MW)",
          },
        },
      } as PlotlyData;
      setPrimitiveData(plotData);
    } catch {
      setError("Failed to get primitive data");
      setStatus("");
    }
  };

  return (
    <div className="App">
      <h1>GridSim</h1>
      <div className="card">
        <button onClick={checkHealth}>Check API Health</button>
        {status && <p>API Status: {status}</p>}
        {error && <p className="error">{error}</p>}
      </div>
      <div className="card">
        <button onClick={getPrimitiveData}>Get primitive data</button>

        {error && <p className="error">{error}</p>}
      </div>

      {primitiveData && (
        <Plot
          data={primitiveData.data}
          layout={primitiveData.layout}
          style={{ width: 800, height: 600 }}
        />
      )}
    </div>
  );
}
