import { averageMarginalPrice } from "../../data/results";
import { ComparisonResult } from "../../types";
import { Plot, PlotProps } from "../Plot";

type MarginalPriceDeltaProps = {
  comparison: ComparisonResult;
};

export function MarginalPriceDelta({ comparison }: MarginalPriceDeltaProps) {
  const averageMarginalPriceBefore = averageMarginalPrice(
    comparison.before.response
  );
  const averageMarginalPriceAfter = averageMarginalPrice(
    comparison.after.response
  );

  const trace1 = {
    y: [""],
    x: [averageMarginalPriceBefore],
    name: comparison.before.name,
    type: "bar",
    orientation: "h",
  } as const;

  const trace2 = {
    y: [""],
    x: [averageMarginalPriceAfter],
    name: comparison.after.name,
    type: "bar",
    orientation: "h",
  } as const;

  const layout = { barmode: "group", width: 300 } as const;

  const props: PlotProps = {
    data: [trace1, trace2],
    layout,
  };

  return <Plot {...props} />;
}
