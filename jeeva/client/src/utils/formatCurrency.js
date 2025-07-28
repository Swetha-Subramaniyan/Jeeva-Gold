export const formatINRCurrency = (amount) => {
  if (amount === "" || isNaN(amount)) return "";

  const num = parseFloat(amount);

  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  }).format(num);
};
