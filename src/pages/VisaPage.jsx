import { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { FaWhatsapp, FaChevronDown } from "react-icons/fa"
import AuthModal from "../components/AuthModal"

const visaData = [
  {
    id: "uae-e-visa",
    country: "UAE",
    displayCountry: "UAE / Dubai",
    title: "UAE E-Visa",
    type: "E-Visa",
    requirements: [
      "Passport size picture",
      "Passport scan copy with 6 months validity, 1st and 2nd page",
      "NIC scan copy",
    ],
    steps: [
      "Fill out the form.",
      "Pay online with easy payment methods.",
      "Provide all necessary documents.",
      "Enjoy your trip.",
    ],
  },
  {
    id: "sri-lanka-e-visa",
    country: "Sri Lanka",
    displayCountry: "Sri Lanka",
    title: "Sri Lanka E-Visa",
    type: "E-Visa",
    requirements: ["Passport with 6 months validity", "Hotel reservation"],
    steps: [
      "Fill out the form.",
      "Pay online with easy payment methods.",
      "Provide all necessary documents.",
      "Enjoy your trip.",
    ],
  },
  {
    id: "malaysia-e-visa",
    country: "Malaysia",
    displayCountry: "Malaysia",
    title: "Malaysia E-Visa",
    type: "E-Visa",
    requirements: [
      "Passport",
      "Passport-size picture with white background",
      "NIC",
      "3 months personal bank statement with account maintenance letter signed and stamped by bank, closing balance 3 lac",
    ],
    steps: [
      "Fill out the form.",
      "Pay online with easy payment methods.",
      "Provide all necessary documents.",
      "Enjoy your trip.",
    ],
  },
  {
    id: "spain-visa",
    country: "Spain",
    displayCountry: "Spain",
    title: "Spain Visa Requirements",
    type: "Visa",
    fee: "Spain Tourist Visa fee is PKR 18,518",
    requirements: [
      "Schengen visa application form duly filled and signed by applicant",
      "2 recent colour passport-size photos with white background",
      "Original and photocopy of passport or official travel document",
      "Visa fee",
      "Medical insurance covering €30,000 including repatriation",
      "Copy of Pakistani identity card CNIC",
      "Return flight reservation",
      "Accommodation reservation for entire stay",
      "Family Registration Certificate FRC issued in English by NADRA",
      "Bank statements for last six months, signed and stamped by bank",
      "NTN certificate or proof of exemption and FBR tax returns",
      "Employment, business, student, retired, or sponsorship documents if applicable",
    ],
    steps: [
      "Prepare all required documents.",
      "Submit complete application with supporting documents.",
      "Pay visa fee where required.",
      "Wait for embassy or consulate decision.",
    ],
  },
  {
    id: "egypt-visa",
    country: "Egypt",
    displayCountry: "Egypt",
    title: "Egypt Visa",
    type: "Visa",
    fee: "Egypt visa fee PKR 18,000*",
    processing: "Processing time: 35 to 40 days",
    requirements: [
      "8 months valid original passport with signature page signed",
      "CNIC copy",
      "2 photographs white background 2x2 size",
      "Updated 3 months bank statement with minimum PKR 300,000 closing balance",
      "Account maintenance certificate from bank",
      "Employment letter for working applicants",
      "Polio certificate from government hospital with sign and IPV stamp",
      "NTN",
      "Dengue report",
      "Confirmed hotel reservation and invitation intimation to Egypt Embassy Islamabad",
    ],
    note: "Approval is subject to Egypt Embassy / Consulate.",
    steps: [
      "Prepare all required documents.",
      "Submit documents for embassy or consulate processing.",
      "Wait for approval decision.",
      "Collect passport after processing.",
    ],
  },
  {
    id: "turkey-visa",
    country: "Turkey",
    displayCountry: "Turkey",
    title: "Turkey Visa",
    type: "Visa",
    requirements: [
      "Visa application form duly filled and printed with two coloured biometric photos",
      "Passport valid for at least 6 months from travel date",
      "Copies of bio data and used pages of old passports on A4 size",
      "Income documents such as salary checks, FBR, NTN, Active Tax Payer Certificate",
      "Family registration certificate or marriage registration certificate from NADRA",
      "Cover letter explaining planned visit, purpose, places to visit, expenses, and travel details",
      "Bank statements of last 3 months signed and stamped by bank",
      "Bank account maintenance certificate where applicable",
      "Return ticket reservation or proof of onward journey",
      "Hotel reservation or invitation letter",
      "Travel health insurance covering Euro 30,000 / USD 50,000",
    ],
    note: "Submitting documents does not guarantee visa issuance. Embassy decision is final.",
    steps: [
      "Prepare mandatory and conditional documents.",
      "Ensure documents are in English, readable, scannable, and A4 format.",
      "Submit complete application.",
      "Wait for embassy decision.",
    ],
  },
]

const VisaPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [selectedCountry, setSelectedCountry] = useState(
    searchParams.get("country") || "UAE"
  )
  const [selectedType, setSelectedType] = useState(
    searchParams.get("type") || "E-Visa"
  )

  const [countryOpen, setCountryOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [pendingBookingPath, setPendingBookingPath] = useState("")

  useEffect(() => {
    setSelectedCountry(searchParams.get("country") || "UAE")
    setSelectedType(searchParams.get("type") || "E-Visa")
  }, [searchParams])

  const selectedVisa = useMemo(() => {
    return (
      visaData.find((visa) => {
        const typeFromUrl =
          selectedType === "Sticker Visa" ? "Visa" : selectedType

        return visa.country === selectedCountry && visa.type === typeFromUrl
      }) || visaData[0]
    )
  }, [selectedCountry, selectedType])

  const eVisaOptions = visaData.filter((visa) => visa.type === "E-Visa")
  const visaOptions = visaData.filter((visa) => visa.type === "Visa")

  const handleCountrySelect = (visa) => {
    if (!visa) return

    const urlType = visa.type === "Visa" ? "Sticker Visa" : visa.type

    setSelectedCountry(visa.country)
    setSelectedType(urlType)
    setCountryOpen(false)

    navigate(
      `/visa?country=${encodeURIComponent(
        visa.country
      )}&type=${encodeURIComponent(urlType)}`
    )
  }

  const handleApplyNow = () => {
    setPendingBookingPath(`/booking/visa/${selectedVisa.id}`)
    setAuthOpen(true)
  }

  return (
    <main className="bg-white">
      {/* Top Header */}
      <section className="border-b border-slate-100 bg-white py-6 sm:py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#00AEEF] sm:text-sm">
            Visa Assistance
          </p>

          <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-medium text-slate-950 sm:text-4xl">
                {selectedVisa.title}
              </h1>

              <p className="mt-2 text-sm font-semibold text-slate-500">
                Check requirements and apply with TravelEx support.
              </p>
            </div>

            <div className="relative w-full md:w-72">
              <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-400">
                Change Country
              </label>

              <button
                type="button"
                onClick={() => setCountryOpen(!countryOpen)}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-black text-slate-900 outline-none transition focus:border-[#00AEEF]"
              >
                <span>{selectedVisa.displayCountry}</span>

                <FaChevronDown
                  className={`text-xs text-slate-500 transition-transform ${
                    countryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {countryOpen && (
                <div className="absolute left-0 right-0 top-[76px] z-50 max-h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
                  <div className="border-b border-slate-100 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                    E-Visa
                  </div>

                  {eVisaOptions.map((visa) => (
                    <button
                      key={visa.id}
                      type="button"
                      onClick={() => handleCountrySelect(visa)}
                      className={`block w-full px-4 py-3 text-left text-sm font-bold transition ${
                        selectedVisa.id === visa.id
                          ? "bg-[#00AEEF] text-white"
                          : "text-slate-700 hover:bg-sky-50 hover:text-[#00AEEF]"
                      }`}
                    >
                      {visa.displayCountry}
                    </button>
                  ))}

                  <div className="border-y border-slate-100 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Visa
                  </div>

                  {visaOptions.map((visa) => (
                    <button
                      key={visa.id}
                      type="button"
                      onClick={() => handleCountrySelect(visa)}
                      className={`block w-full px-4 py-3 text-left text-sm font-bold transition ${
                        selectedVisa.id === visa.id
                          ? "bg-[#00AEEF] text-white"
                          : "text-slate-700 hover:bg-sky-50 hover:text-[#00AEEF]"
                      }`}
                    >
                      {visa.displayCountry}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Content */}
      <section className="py-6 sm:py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {/* Badges */}
          <div className="mb-6 border-b border-slate-200 pb-5">
            <div className="flex flex-wrap gap-3">
              <span
                className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider ${
                  selectedVisa.type === "E-Visa"
                    ? "bg-sky-50 text-[#00AEEF]"
                    : "bg-orange-50 text-[#FF6B00]"
                }`}
              >
                {selectedVisa.type}
              </span>

              {selectedVisa.fee && (
                <span className="rounded-full bg-slate-50 px-4 py-2 text-xs font-black text-slate-600">
                  {selectedVisa.fee}
                </span>
              )}

              {selectedVisa.processing && (
                <span className="rounded-full bg-slate-50 px-4 py-2 text-xs font-black text-slate-600">
                  {selectedVisa.processing}
                </span>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-slate-950">
              Requirements
            </h3>

            <div className="mt-5 space-y-4">
              {selectedVisa.requirements.map((item, index) => (
                <p
                  key={item}
                  className="text-sm font-semibold leading-7 text-slate-700"
                >
                  {index + 1}. {item}
                </p>
              ))}
            </div>

            {selectedVisa.note && (
              <p className="mt-6 rounded-xl bg-orange-50 p-4 text-sm font-bold leading-7 text-orange-700">
                Note: {selectedVisa.note}
              </p>
            )}
          </div>

          <div className="mt-8 border-t border-slate-200 pt-6">
            <h3 className="text-2xl font-medium text-slate-950">
              How to Apply
            </h3>

            <div className="mt-5 space-y-4">
              {selectedVisa.steps.map((step, index) => (
                <p
                  key={step}
                  className="text-sm font-semibold leading-7 text-slate-700"
                >
                  <span className="font-black text-slate-950">
                    Step {index + 1}:
                  </span>{" "}
                  {step}
                </p>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleApplyNow}
                className="rounded-xl bg-[#14213D] px-7 py-3 text-sm font-black text-white transition hover:bg-[#FF6B00]"
              >
                Apply Now
              </button>

              <a
                href="https://wa.me/923111444192"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-black text-slate-900 transition hover:border-[#25D366] hover:text-[#25D366]"
              >
                <FaWhatsapp />
                Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        bookingPath={pendingBookingPath}
      />
    </main>
  )
}

export default VisaPage