import { useMatches } from "@mantine/core";

export type ResponsiveMode = "mobile" | "tablet" | "desktop";

export function useResponsiveMode(): ResponsiveMode {
  return (
    useMatches({
      sm: "mobile",
      md: "tablet",
      lg: "desktop",
    }) ?? "mobile"
  );
}
