export const formatNumber = (value, precision) => {
  if (isNaN(value)) return "-";
  const floatVal = parseFloat(value);
  return floatVal % 1 === 0
    ? parseInt(floatVal)
    : floatVal.toFixed(precision).replace(/\.?0+$/, "");
};
