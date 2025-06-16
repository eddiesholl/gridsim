import { useResponsiveMode } from "../../common/use-responsive-mode";
import { DesktopContent } from "./DesktopContent";
import { MobileContent } from "./MobileContent";
import { TabletContent } from "./TabletContent";
import { ResponsiveContentProps } from "./types";

export const ResponsiveContent = ({
  title,
  text,
  content,
}: ResponsiveContentProps) => {
  const mode = useResponsiveMode();

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
