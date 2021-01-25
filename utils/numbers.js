export const formatCurrency = (value, { withCurrency = false } = {}) => {
  const formatted = Intl.NumberFormat('en-IN', { style: 'currency', currency: 'USD' })
    .format((value))

  if (!withCurrency) return formatted.substring(1, formatted.length)
  else return formatted
}