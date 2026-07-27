const ChildAgeFields = ({
  ages = [],
  onChange,
  labelClass,
  inputClass,
  className = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
}) => {
  if (!ages.length) return null

  return (
    <div className={className}>
      {ages.map((age, index) => (
        <div key={`child-age-${index}`}>
          <label className={labelClass}>Child {index + 1} Age *</label>

          <input
            type="number"
            min="0"
            max="17"
            value={age}
            onChange={(event) => onChange(index, event.target.value)}
            placeholder="Age"
            className={inputClass}
          />
        </div>
      ))}
    </div>
  )
}

export default ChildAgeFields
