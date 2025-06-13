import { hsl } from "d3-color";

// A function that takes a # based color and returns a color that is 50% more saturated
export const darkenColor = (color: string, factor: number = 0.5) =>
  hsl(color).darker(factor).rgb().toString();
