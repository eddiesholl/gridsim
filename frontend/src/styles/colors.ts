// Function to generate color shades
function generateColorShades(
  hex: string
): readonly [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
] {
  // Convert hex to RGB
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // Generate darker shades (4 shades)
  const darkerShades = Array.from({ length: 4 }, (_, i) => {
    const factor = 1 - (i + 1) * 0.15;
    const newR = Math.round(r * factor);
    const newG = Math.round(g * factor);
    const newB = Math.round(b * factor);
    return `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
  });

  // Generate lighter shades (5 shades)
  const lighterShades = Array.from({ length: 5 }, (_, i) => {
    const factor = 1 + (i + 1) * 0.15;
    const newR = Math.min(255, Math.round(r * factor));
    const newG = Math.min(255, Math.round(g * factor));
    const newB = Math.min(255, Math.round(b * factor));
    return `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
  }).reverse();

  // Combine all shades (4 darker + 1 base + 5 lighter = 10 total)
  const shades = [...lighterShades, `#${hex}`, ...darkerShades] as const;

  // Assert that we have exactly 10 elements
  if (shades.length !== 10) {
    throw new Error(`Expected 10 color shades, got ${shades.length}`);
  }

  return shades as readonly [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ];
}

export const baseColors = {
  moonstone: "729ea1",
  sage: "b5bd89",
  tan: "dfbe99",
  coral: "ec9192",
  blush: "db5375",
};

export const colorRanges = {
  moonstone: generateColorShades(baseColors.moonstone),
  sage: generateColorShades(baseColors.sage),
  tan: generateColorShades(baseColors.tan),
  coral: generateColorShades(baseColors.coral),
  blush: generateColorShades(baseColors.blush),
};

export const chartColors = {
  bittersweet: "ff595e",
  tangerine: "ff924c",
  sunglow: "ffca3a",
  yellowGreen: "8ac926",
  steelBlue: "1982c4",
  ultraViolet: "6a4c93",
  lightBlue: "90e0ef",
};

export const chartColorArray = [
  chartColors.bittersweet,
  chartColors.tangerine,
  chartColors.sunglow,
  chartColors.yellowGreen,
  chartColors.steelBlue,
  chartColors.ultraViolet,
  chartColors.lightBlue,
];
