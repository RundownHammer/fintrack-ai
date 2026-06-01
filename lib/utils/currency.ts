export const formatInr = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export const formatInrCompact = (value: number) =>
  `₹${(value / 1000).toFixed(0)}k`;

export const formatInrLakhs = (value: number) =>
  `₹${(value / 100000).toFixed(1)}L`;
