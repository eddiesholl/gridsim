import Plotly from "react-plotly.js";

type PlotProps = {
  data: Plotly.Data[];
  layout: Plotly.Layout;
};

export function Plot({ data, layout }: PlotProps) {
  return <Plotly data={data} layout={layout} />;
}
