export function formatINR(amount) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`
  return `₹${amount}`
}

export function formatRating(rating) {
  return `${Number(rating).toFixed(1)}⭐`
}

export function formatNumber(num) {
  return new Intl.NumberFormat('en-IN').format(num)
}

export function truncate(str, length = 100) {
  if (!str || str.length <= length) return str
  return str.slice(0, length) + '...'
}
