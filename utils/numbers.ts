//TODO: remove this function entirely in future; not understandable
export const formatCurrency = (value, { withCurrency = false } = {}) => {
  const formatted = Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "USD",
  }).format(value);

  if (!withCurrency) return formatted.substring(1, formatted.length);
  else return formatted;
};

export const formatAmount = (
  value: number,
  currency: string,
  locale = "en-US"
) => {
  return Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
};
