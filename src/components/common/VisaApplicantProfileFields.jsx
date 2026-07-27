import AppSelect from "./AppSelect"
import { isUnitedKingdomDestination } from "../../utils/visaDestination"

const occupationOptions = ["Employment", "Business", "Student", "Others"]
const yesNoOptions = ["Yes", "No"]

const VisaApplicantProfileFields = ({
  formData,
  onChange,
  onSelectChange,
  inputClass,
  labelClass,
  className = "",
}) => {
  const isEmployment = formData.currentOccupation === "Employment"
  const isBusiness = formData.currentOccupation === "Business"
  const isStudent = formData.currentOccupation === "Student"
  const isOther = formData.currentOccupation === "Others"
  const needsSponsorDetails = isStudent || isOther
  const isUkDestination = isUnitedKingdomDestination(formData.destinationCountry)

  return (
    <div className={className}>
      <div className="grid gap-4 sm:grid-cols-2">
        <AppSelect
          label="Current Occupation *"
          value={formData.currentOccupation}
          onChange={(value) => onSelectChange("currentOccupation", value)}
          placeholder="Select occupation"
          options={occupationOptions}
        />

        {isEmployment && (
          <div>
            <label className={labelClass}>Monthly Income *</label>
            <input
              type="text"
              name="monthlyIncome"
              value={formData.monthlyIncome}
              onChange={onChange}
              placeholder="Example: PKR 150,000"
              className={inputClass}
            />
          </div>
        )}

        {isBusiness && (
          <div>
            <label className={labelClass}>Yearly Income *</label>
            <input
              type="text"
              name="yearlyIncome"
              value={formData.yearlyIncome}
              onChange={onChange}
              placeholder="Example: PKR 2,500,000"
              className={inputClass}
            />
          </div>
        )}

        {isOther && (
          <div>
            <label className={labelClass}>Occupation Details *</label>
            <input
              type="text"
              name="otherOccupation"
              value={formData.otherOccupation}
              onChange={onChange}
              placeholder="Example: Housewife, retired"
              className={inputClass}
            />
          </div>
        )}

        {needsSponsorDetails && (
          <AppSelect
            label="Sponsored? *"
            value={formData.isSponsored}
            onChange={(value) => onSelectChange("isSponsored", value)}
            placeholder="Select option"
            options={yesNoOptions}
          />
        )}

        {needsSponsorDetails && formData.isSponsored === "Yes" && (
          <div>
            <label className={labelClass}>Income Source of Sponsor *</label>
            <input
              type="text"
              name="sponsorIncomeSource"
              value={formData.sponsorIncomeSource}
              onChange={onChange}
              placeholder="Example: Salary, business, pension"
              className={inputClass}
            />
          </div>
        )}
      </div>

      <div
        className={`mt-4 grid gap-4 ${
          isUkDestination ? "sm:grid-cols-3" : "sm:grid-cols-2"
        }`}
      >
        <div>
          <label className={labelClass}>Number of Family Members *</label>
          <input
            type="number"
            name="numberOfFamilyMembers"
            min="0"
            value={formData.numberOfFamilyMembers}
            onChange={onChange}
            placeholder="0"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Available Funds for Visit *</label>
          <input
            type="text"
            name="availableFundsForVisit"
            value={formData.availableFundsForVisit}
            onChange={onChange}
            placeholder="Example: PKR 500,000"
            className={inputClass}
          />
        </div>

        {isUkDestination && (
          <AppSelect
            label="Family or Friend in the UK? *"
            value={formData.hasFamilyOrFriendInUK}
            onChange={(value) => onSelectChange("hasFamilyOrFriendInUK", value)}
            placeholder="Select option"
            options={yesNoOptions}
          />
        )}
      </div>

      {isUkDestination && formData.hasFamilyOrFriendInUK === "Yes" && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <AppSelect
            label="Will They Provide an Invitation Letter? *"
            value={formData.willProvideInvitationLetter}
            onChange={(value) => onSelectChange("willProvideInvitationLetter", value)}
            placeholder="Select option"
            options={yesNoOptions}
          />
        </div>
      )}
    </div>
  )
}

export default VisaApplicantProfileFields
