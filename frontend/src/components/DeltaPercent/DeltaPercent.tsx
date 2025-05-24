import { roundTo } from "../../data/tools";

export type DeltaPercentProps = {
  before: number;
  after: number;
};

export function DeltaPercent({ before, after }: DeltaPercentProps) {
  const delta = after - before;
  const percent = (delta / before) * 100;
  const percentDisplay = roundTo(percent, 0);
  const increased = delta > 0;
  return (
    <span style={{ fontSize: "1.2rem" }}>
      {increased ? "+" : "-"}&nbsp;{percentDisplay}%
    </span>
  );
}
