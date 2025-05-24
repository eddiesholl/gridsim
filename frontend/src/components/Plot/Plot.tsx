import { ComponentProps } from "react";
import Plotly from "react-plotly.js";
import styles from "./styles.module.css";
export type PlotProps = Omit<
  ComponentProps<typeof Plotly>,
  "data" | "layout"
> & {
  data: Partial<Plotly.Data>[];
  layout: Partial<Plotly.Layout>;
  rightText?: string;
};

export function Plot({ data, layout, ...rest }: PlotProps) {
  return (
    <Plotly data={data} layout={layout} className={styles.plot} {...rest} />
  );
}
