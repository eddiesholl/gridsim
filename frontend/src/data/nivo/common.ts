export const serverToNivoData = (
  name: string,
  values: number[],
  index: string[]
) => ({
  id: name,
  data: values.map((y, i) => ({ x: index[i], y })),
});
