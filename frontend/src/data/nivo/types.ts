import { ResponsiveLine } from "@nivo/line";
import { ComponentProps } from "react";
import { ResponsiveMode } from "../../common/use-responsive-mode";

export type DailyDataOptions = {
  includeStoresE?: boolean;
  includeStoresP?: boolean;
  excludeData?: string[];
  responsiveMode?: ResponsiveMode;
  // extraShapes?: Partial<Shape>[];
};

export type MarginalPriceOptions = {
  includeBuses?: string[];
  responsiveMode?: ResponsiveMode;
};

export type NivoLineProps = ComponentProps<typeof ResponsiveLine>;
