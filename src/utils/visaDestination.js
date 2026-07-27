export const isUnitedKingdomDestination = (value) => {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\./g, "")

  return ["united kingdom", "uk", "great britain"].includes(normalized)
}
