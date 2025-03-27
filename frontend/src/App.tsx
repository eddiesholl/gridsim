import { useState } from "react";
import "./App.css";
import { healthCheck } from "./services/api";

function App() {
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

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

  return (
    <div className="App">
      <h1>GridSim</h1>
      <div className="card">
        <button onClick={checkHealth}>Check API Health</button>
        {status && <p>API Status: {status}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default App;
