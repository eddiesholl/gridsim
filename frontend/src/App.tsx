import { useState } from "react";
import Plot from "react-plotly.js";
import "./App.css";
import { getHousehold, healthCheck } from "./services/api";

function App() {
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [householdData, setHouseholdData] = useState<any>(null);
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

  const getHouseholdData = async () => {
    try {
      const response = await getHousehold();
      setHouseholdData(response.data);
      setError("");
    } catch {
      setError("Failed to get household data");
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
        <button onClick={getHouseholdData}>Get household data</button>
        {householdData && (
          <p>Household data: {JSON.stringify(householdData)}</p>
        )}
        {error && <p className="error">{error}</p>}
      </div>
      {householdData && (
        <Plot
          data={householdData}
          layout={{ width: 1000, height: 600 }}
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
}

export default App;
