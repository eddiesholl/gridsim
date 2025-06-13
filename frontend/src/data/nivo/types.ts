import { ResponsiveLine } from "@nivo/line";
import { ComponentProps } from "react";

export type DailyDataOptions = {
  includeStoresE?: boolean;
  includeStoresP?: boolean;
  excludeData?: string[];
  // extraShapes?: Partial<Shape>[];
};

export type MarginalPriceOptions = {
  includeBuses?: string[];
};

export type NivoLineProps = ComponentProps<typeof ResponsiveLine>;
