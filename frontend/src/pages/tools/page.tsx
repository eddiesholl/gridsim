import { Card, Flex, Text, Title } from "@mantine/core";
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

  const colors = ["moonstone", "sage", "tan", "coral", "blush"];

  return (
    <Flex direction="column" gap="xl" align="center">
      <h1>Development tools</h1>
      <h3>Useful for debugging and development</h3>

      <div className="card">
        <button onClick={checkHealth}>Check API Health</button>
        {status && <p>API Status: {status}</p>}
        {timing && <p>Response time: {timing}ms</p>}
        {error && <p className="error">{error}</p>}
      </div>

      {/* <Button color="blush">Click me</Button> */}

      <Card w="100%">
        <Title order={3} pb="xl">
          Color Shades
        </Title>
        <Flex gap="sm" direction="column">
          <Card>
            <Flex>
              {colors.map((color) => (
                <Card c="white" bg={`${color}.5`} flex={1}>
                  <Text>{color}.5</Text>
                </Card>
              ))}
            </Flex>
          </Card>
          {Array.from({ length: 9 }, (_, i) => (
            <Card>
              <Flex>
                {colors.map((color) => (
                  <Card
                    c={i > 4 ? "white" : "black"}
                    bg={`${color}.${i + 1}`}
                    flex={1}
                  >
                    <Text>{`${color}.${i + 1}`}</Text>
                  </Card>
                ))}
              </Flex>
            </Card>
          ))}
        </Flex>
      </Card>

      <Card p="xl" mt="xl">
        <h3>Color Shades</h3>
        <Flex gap="sm">
          {Array.from({ length: 11 }, (_, i) => (
            <div
              key={i}
              style={{
                height: "40px",
                flex: 1,
                // color: `Moonstone.${i})`,
                color: `blush.1`,
                backgroundColor: `blush.1`,
                // backgroundColor: `blue`,
                width: 10,
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                padding: "0 16px",
                // color: i > 5 ? "black" : "white",
              }}
            >
              {/* Moonstone.{i} */}
            </div>
          ))}
        </Flex>
      </Card>
    </Flex>
  );
}
