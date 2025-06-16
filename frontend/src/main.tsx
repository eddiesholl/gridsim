import { MantineProvider } from "@mantine/core";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
// import "./index.css";
import "@mantine/core/styles.css";
import { mantineTheme } from "./styles/theme";
// Import the generated route tree
import { NuqsAdapter } from "nuqs/adapters/react";
import { routeTree } from "./routeTree.gen";
// Create a new router instance
const router = createRouter({
  routeTree,
  defaultPreloadDelay: 2000,
  defaultPreloadStaleTime: 30000,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <MantineProvider theme={mantineTheme} withGlobalClasses>
        <NuqsAdapter>
          <RouterProvider router={router} />
        </NuqsAdapter>
      </MantineProvider>
    </StrictMode>
  );
}
