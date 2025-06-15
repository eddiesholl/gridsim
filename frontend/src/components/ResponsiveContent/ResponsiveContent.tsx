import { useMatches } from "@mantine/core";
import { DesktopContent } from "./DesktopContent";
import { MobileContent } from "./MobileContent";
import { TabletContent } from "./TabletContent";
import { ResponsiveContentProps } from "./types";

type ResponsiveMode = "mobile" | "tablet" | "desktop";

export const ResponsiveContent = ({
  title,
  text,
  content,
}: ResponsiveContentProps) => {
  const mode: ResponsiveMode =
    useMatches({
      sm: "mobile",
      md: "tablet",
      lg: "desktop",
    }) ?? "mobile";

  if (mode === "mobile") {
    return <MobileContent title={title} text={text} content={content} />;
  }

  if (mode === "tablet") {
    return <TabletContent title={title} text={text} content={content} />;
  }

  if (mode === "desktop") {
    return <DesktopContent title={title} text={text} content={content} />;
  }
};
