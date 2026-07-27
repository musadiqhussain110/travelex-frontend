export const getChildCount = (value) => {
  return Math.max(0, Math.floor(Number(value) || 0))
}

export const resizeChildAges = (currentAges = [], childCountValue = 0) => {
  const childCount = getChildCount(childCountValue)

  return Array.from(
    { length: childCount },
    (_, index) => currentAges[index] ?? ""
  )
}

export const getChildAgesError = (childAges = [], childCountValue = 0) => {
  const childCount = getChildCount(childCountValue)
  const relevantAges = childAges.slice(0, childCount)

  if (
    relevantAges.length !== childCount ||
    relevantAges.some(
      (age) =>
        age === "" ||
        !Number.isInteger(Number(age)) ||
        Number(age) < 0 ||
        Number(age) > 17
    )
  ) {
    return "Please enter a valid age from 0 to 17 for every child."
  }

  return ""
}

export const normalizeChildAges = (childAges = [], childCountValue = 0) => {
  const childCount = getChildCount(childCountValue)
  return childAges.slice(0, childCount).map(Number)
}
