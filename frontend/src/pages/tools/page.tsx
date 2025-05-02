import { useState } from "react";
import { healthCheck } from "../../services/api";
import "./App.css";

type HealthCheckStatus = "unknown" | "checking" | "healthy" | "unhealthy";

export function ToolsPage() {
  const [status, setStatus] = useState<HealthCheckStatus>("unknown");
  const [timing, setTiming] = useState<number | undefined>();
  const [error, setError] = useState<string>("");
  const checkHealth = async () => {
    const start = performance.now();
    setTiming(undefined);
    try {
      const response = await healthCheck();
      const end = performance.now();
      setTiming(end - start);
      if (response.status === "healthy") {
        setStatus("healthy");
      } else {
        setStatus("unhealthy");
      }
      setError("");
    } catch {
      const end = performance.now();
      setTiming(end - start);
      setError("Failed to connect to API");
      setStatus("unhealthy");
    }
  };

  return (
    <div className="App">
      <h1>Development tools</h1>
      <h3>Useful for debugging and development</h3>
      <div className="card">
        <button onClick={checkHealth}>Check API Health</button>
        {status && <p>API Status: {status}</p>}
        {timing && <p>Response time: {timing}ms</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
