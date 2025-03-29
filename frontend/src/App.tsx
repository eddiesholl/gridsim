import { useState } from "react";
import Plot from "react-plotly.js";
import "./App.css";
import { getHousehold, getNem, healthCheck } from "./services/api";

function App() {
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [householdData, setHouseholdData] = useState<any>(null);
  const [nemData, setNemData] = useState<any>(null);
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

  const getNemData = async () => {
    try {
      const response = await getNem();
      console.log(response);
      setNemData(response);
    } catch {
      setError("Failed to get NEM data");
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
        <button onClick={getNemData}>Get NEM data</button>
        {/* {nemData && <p>NEM data: {JSON.stringify(nemData)}</p>} */}
        {error && <p className="error">{error}</p>}
      </div>
      {/* <div className="card">
        <button onClick={getHouseholdData}>Get household data</button>
        {householdData && (
          <p>Household data: {JSON.stringify(householdData)}</p>
        )}
        {error && <p className="error">{error}</p>}
      </div> */}
      {nemData && (
        <Plot
          data={nemData.data}
          layout={nemData.layout}
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
}

export default App;
