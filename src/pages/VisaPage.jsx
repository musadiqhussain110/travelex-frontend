import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import {
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaFileAlt,
  FaInfoCircle,
  FaMoneyBillWave,
  FaPassport,
  FaSearch,
  FaWhatsapp,
} from "react-icons/fa"

import Footer from "../components/Footer"
import { visaServices } from "../data/visaData"
import visaHero from "../assets/visa/visa.png"

const getVisaWhatsappLink = (visa) =>
  `https://wa.me/923111444192?text=${encodeURIComponent(
    `Assalamualaikum TravelEx, I need guidance about ${visa.title}. Please share details and process.`
  )}`

const getVisaApplyLink = (visa) =>
  `/visa/apply?country=${encodeURIComponent(
    visa.country
  )}&visa=${encodeURIComponent(visa.title)}&type=${encodeURIComponent(
    visa.type
  )}`

const findVisaByQuery = (query) => {
  if (!query) return null

  const normalizedQuery = query.toLowerCase().trim()

  return visaServices.find((visa) => {
    const title = visa.title.toLowerCase()
    const country = visa.country.toLowerCase()
    const type = visa.type.toLowerCase()

    return (
      title.includes(normalizedQuery) ||
      country.includes(normalizedQuery) ||
      type.includes(normalizedQuery)
    )
  })
}

const VisaPage = () => {
  const [searchParams] = useSearchParams()
  const countryFromUrl = searchParams.get("country") || ""

  const matchedVisa = findVisaByQuery(countryFromUrl) || visaServices[0]

  const [selectedVisaId, setSelectedVisaId] = useState(matchedVisa.id)
  const [searchTerm, setSearchTerm] = useState(countryFromUrl)

  const countryListRef = useRef(null)

  const filteredVisas = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    if (!query) return visaServices

    return visaServices.filter((visa) => {
      return (
        visa.title.toLowerCase().includes(query) ||
        visa.country.toLowerCase().includes(query) ||
        visa.type.toLowerCase().includes(query)
      )
    })
  }, [searchTerm])

  const selectedVisa =
    visaServices.find((visa) => visa.id === selectedVisaId) || visaServices[0]

  useEffect(() => {
    if (!countryFromUrl) return

    const matched = findVisaByQuery(countryFromUrl)

    setSearchTerm(countryFromUrl)

    if (matched) {
      setSelectedVisaId(matched.id)
    }
  }, [countryFromUrl])

  useEffect(() => {
    const list = countryListRef.current

    if (!list) return

    const handleWheel = (event) => {
      event.preventDefault()
      event.stopPropagation()
      list.scrollTop += event.deltaY
    }

    list.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      list.removeEventListener("wheel", handleWheel)
    }
  }, [])

  return (
    <main className="bg-[#F8FAFC]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <img
          src={visaHero}
          alt="Visa assistance by TravelEx"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-slate-950/45 to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto max-w-[1340px] px-4 py-7 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="max-w-4xl">
            <p className="font-poppins text-[8px] font-bold uppercase tracking-[0.22em] text-[#00AEEF] sm:text-[12px]">
              Visa Assistance
            </p>

            <h1 className="mt-1 font-fredoka text-[17px] font-semibold leading-[1.08] text-white sm:mt-2 sm:text-[46px] sm:uppercase sm:leading-[1.1] lg:text-[54px]">
              <span className="sm:hidden">Visa Requirements</span>
              <span className="hidden sm:inline">
                Visa checklist and requirements
              </span>
            </h1>

            <p className="mt-1 max-w-3xl font-poppins text-[9px] font-medium leading-4 text-white/85 sm:mt-3 sm:text-base sm:leading-7">
              <span className="sm:hidden">
                Country-wise checklist and process.
              </span>

              <span className="hidden sm:inline">
                Select a destination and view visa fee, processing time, required
                documents, and application details based on TravelEx visa
                checklist.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Visa Content */}
      <section className="bg-[#F8FAFC] pb-8 pt-4 sm:py-14">
        <div className="mx-auto grid max-w-[1440px] gap-4 px-4 sm:px-6 lg:grid-cols-[330px_1fr] lg:gap-6 lg:px-8">
          {/* Left Country List */}
          <aside className="h-fit rounded-[12px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-5 lg:sticky lg:top-24">
            <div>
              <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.24em] text-[#00AEEF] sm:mb-2 sm:text-[12px] sm:tracking-[0.18em]">
                Destinations
              </p>

              <h2 className="font-fredoka text-[18px] font-semibold leading-[1.08] text-slate-950 sm:text-[28px]">
                Select Visa
              </h2>

              <p className="mt-1 max-w-2xl font-poppins text-[10px] font-medium leading-4 text-slate-600 sm:mt-1.5 sm:text-sm sm:leading-7">
                <span className="sm:hidden">
                  Search destination and view details.
                </span>

                <span className="hidden sm:inline">
                  Only countries included in the checklist PDF are shown here.
                </span>
              </p>
            </div>

            <div className="relative mt-3 sm:mt-5">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search country..."
                className="h-10 w-full rounded-[5px] border border-slate-200 bg-[#F8FAFC] pl-10 pr-4 font-poppins text-xs font-semibold text-slate-900 outline-none transition focus:border-[#00AEEF] focus:bg-white sm:h-12 sm:pl-11 sm:text-sm"
              />
            </div>

            <div
              ref={countryListRef}
              className="mt-3 grid max-h-[260px] gap-2 overflow-y-auto overscroll-contain pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:mt-5 sm:max-h-[360px] sm:pr-2 lg:max-h-[520px]"
            >
              {filteredVisas.length > 0 ? (
                filteredVisas.map((visa) => {
                  const isActive = selectedVisa.id === visa.id

                  return (
                    <button
                      key={visa.id}
                      type="button"
                      onClick={() => setSelectedVisaId(visa.id)}
                      className={`rounded-[5px] px-3.5 py-2.5 text-left transition sm:px-4 sm:py-3 ${
                        isActive
                          ? "bg-[#00AEEF] text-white shadow-[0_10px_25px_rgba(0,174,239,0.18)]"
                          : "bg-[#F8FAFC] text-slate-700 hover:bg-sky-50 hover:text-[#00AEEF]"
                      }`}
                    >
                      <span className="block font-poppins text-xs font-bold sm:text-sm">
                        {visa.country}
                      </span>

                      <span
                        className={`mt-0.5 block font-poppins text-[10px] font-semibold sm:mt-1 sm:text-xs ${
                          isActive ? "text-white/75" : "text-slate-400"
                        }`}
                      >
                        {visa.type}
                      </span>
                    </button>
                  )
                })
              ) : (
                <div className="rounded-[5px] bg-[#F8FAFC] p-4 text-center">
                  <p className="font-poppins text-sm font-semibold text-slate-600">
                    No visa found.
                  </p>
                </div>
              )}
            </div>
          </aside>

          {/* Visa Details */}
          <div className="grid gap-4 sm:gap-6">
            {/* Detail Header */}
            <section className="overflow-hidden rounded-[12px] border border-slate-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <div className="border-b border-slate-100 p-4 sm:p-7">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.24em] text-[#00AEEF] sm:mb-2 sm:text-[12px] sm:tracking-[0.18em]">
                      {selectedVisa.type}
                    </p>

                    <h2 className="font-fredoka text-[20px] font-semibold leading-[1.08] text-slate-950 sm:text-[42px]">
                      {selectedVisa.title}
                    </h2>

                    <p className="mt-1.5 font-poppins text-[10.5px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-7">
                      View fee, processing time and document checklist for{" "}
                      {selectedVisa.country}.
                    </p>
                  </div>

                  <div className="grid gap-2 sm:flex sm:shrink-0">
                    <Link
                      to={getVisaApplyLink(selectedVisa)}
                      className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:py-3 sm:text-sm"
                    >
                      Apply Now
                      <FaArrowRight className="text-[10px] sm:text-xs" />
                    </Link>

                    <a
                      href={getVisaWhatsappLink(selectedVisa)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:py-3 sm:text-sm"
                    >
                      <FaWhatsapp />
                      Ask on WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid gap-2 p-4 sm:grid-cols-3 sm:gap-3 sm:p-7">
                <div className="rounded-[5px] bg-[#F8FAFC] p-3.5 sm:p-4">
                  <FaMoneyBillWave className="text-lg text-[#00AEEF] sm:text-xl" />

                  <p className="mt-2 font-poppins text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:mt-3 sm:text-[10px]">
                    {selectedVisa.feeTitle}
                  </p>

                  <p className="mt-1 font-poppins text-xs font-semibold leading-5 text-slate-950 sm:text-sm sm:leading-6">
                    {selectedVisa.fee}
                  </p>
                </div>

                <div className="rounded-[5px] bg-[#F8FAFC] p-3.5 sm:p-4">
                  <FaClock className="text-lg text-[#00AEEF] sm:text-xl" />

                  <p className="mt-2 font-poppins text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:mt-3 sm:text-[10px]">
                    Processing Time
                  </p>

                  <p className="mt-1 font-poppins text-xs font-semibold leading-5 text-slate-950 sm:text-sm sm:leading-6">
                    {selectedVisa.processingTime}
                  </p>
                </div>

                <div className="rounded-[5px] bg-[#F8FAFC] p-3.5 sm:p-4">
                  <FaPassport className="text-lg text-[#00AEEF] sm:text-xl" />

                  <p className="mt-2 font-poppins text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:mt-3 sm:text-[10px]">
                    Country
                  </p>

                  <p className="mt-1 font-poppins text-xs font-semibold leading-5 text-slate-950 sm:text-sm sm:leading-6">
                    {selectedVisa.country}
                  </p>
                </div>
              </div>
            </section>

            {/* Requirements */}
            <section className="rounded-[12px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-7">
              <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.24em] text-[#00AEEF] sm:mb-2 sm:text-[12px] sm:tracking-[0.18em]">
                Required Documents
              </p>

              <h3 className="font-fredoka text-[20px] font-semibold leading-[1.08] text-slate-950 sm:text-[30px]">
                Document checklist
              </h3>

              <p className="mt-1.5 font-poppins text-[10.5px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-7">
                Prepare clear scanned copies of these documents.
              </p>

              <div className="mt-3 grid gap-2 sm:mt-5 sm:grid-cols-2 sm:gap-3">
                {selectedVisa.documents.map((document) => (
                  <div
                    key={document}
                    className="flex items-start gap-2.5 rounded-[5px] bg-[#F8FAFC] px-3.5 py-2.5 sm:gap-3 sm:px-4 sm:py-3"
                  >
                    <FaCheckCircle className="mt-1 shrink-0 text-[12px] text-[#00AEEF] sm:text-base" />

                    <p className="font-poppins text-[11px] font-semibold leading-5 text-slate-700 sm:text-sm sm:leading-6">
                      {document}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Additional Details */}
            {selectedVisa.details?.length > 0 && (
              <section className="rounded-[12px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-7">
                <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.24em] text-[#00AEEF] sm:mb-2 sm:text-[12px] sm:tracking-[0.18em]">
                  Additional Details
                </p>

                <h3 className="font-fredoka text-[20px] font-semibold leading-[1.08] text-slate-950 sm:text-[30px]">
                  Important information
                </h3>

                <div className="mt-3 grid gap-2 sm:mt-5 sm:gap-3">
                  {selectedVisa.details.map((detail) => (
                    <div
                      key={detail}
                      className="flex items-start gap-2.5 rounded-[5px] bg-[#F8FAFC] px-3.5 py-2.5 sm:gap-3 sm:px-4 sm:py-3"
                    >
                      <FaFileAlt className="mt-1 shrink-0 text-[12px] text-[#FF6B00] sm:text-base" />

                      <p className="font-poppins text-[11px] font-semibold leading-5 text-slate-700 sm:text-sm sm:leading-6">
                        {detail}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Note CTA */}
            <section className="rounded-[12px] border border-[#FF6B00]/15 bg-orange-50 p-4 sm:p-6">
              <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                <div className="flex gap-2.5 sm:gap-3">
                  <FaInfoCircle className="mt-1 shrink-0 text-sm text-[#FF6B00] sm:text-base" />

                  <div>
                    <h3 className="font-fredoka text-[20px] font-semibold leading-tight text-slate-950 sm:text-[24px]">
                      Need help with this visa?
                    </h3>

                    <p className="mt-1.5 font-poppins text-[11px] font-semibold leading-5 text-orange-800 sm:mt-2 sm:text-sm sm:leading-7">
                      Visa charges and requirements may change. Contact TravelEx
                      before final submission.
                    </p>
                  </div>
                </div>

                <Link
                  to={getVisaApplyLink(selectedVisa)}
                  className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
                >
                  Apply Now
                  <FaArrowRight className="text-[10px] sm:text-xs" />
                </Link>
              </div>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default VisaPage