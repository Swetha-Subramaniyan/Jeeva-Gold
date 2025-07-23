export const formatINRCurrency = (amount) => {
  if (amount === "" || isNaN(amount)) return "";
  return `${new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(amount)}`;
};
