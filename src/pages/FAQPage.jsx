import { useState } from "react"
import { FaChevronDown, FaPhoneAlt, FaWhatsapp } from "react-icons/fa"
import { Link } from "react-router-dom"

import Footer from "../components/Footer"

const faqs = [
  {
    question: "What services does TravelEx offer?",
    answer:
      "TravelEx offers tour packages, flight bookings, hotel reservations, transportation arrangements, visa assistance, travel insurance, and more. They serve both individual travelers and groups.",
  },
  {
    question: "How can I book a tour or travel service with TravelEx?",
    answer:
      "You can explore services on the website and send an inquiry. You can also contact TravelEx through phone or WhatsApp, and the support team will guide you through the booking process.",
  },
  {
    question: "Are TravelEx tour packages customizable?",
    answer:
      "Yes. TravelEx offers customizable packages based on your travel dates, hotel preference, destinations, activities, budget, and number of travelers.",
  },
  {
    question: "How can I make payment for my booking?",
    answer:
      "Payment methods may depend on the selected service and booking type. TravelEx support can guide you about available payment options during the booking process.",
  },
  {
    question: "Does TravelEx provide travel insurance?",
    answer:
      "Yes. TravelEx can assist with travel insurance options. Coverage details and pricing can be discussed with the customer support team.",
  },
  {
    question: "What happens if I need to cancel or modify my booking?",
    answer:
      "Cancellation or modification depends on the package terms, supplier policies, airline rules, hotel policy, and booking conditions. It is best to contact TravelEx support for proper guidance.",
  },
  {
    question: "Are there any age restrictions for TravelEx tours?",
    answer:
      "Some tours are suitable for all ages, while others may have restrictions depending on activities and travel conditions. You can confirm suitability with the TravelEx team before booking.",
  },
  {
    question: "Can TravelEx assist with visa applications?",
    answer:
      "Yes. TravelEx provides visa assistance and guidance for different destinations. Final visa approval depends on the relevant embassy or consulate.",
  },
  {
    question: "How can I contact TravelEx for queries or support?",
    answer:
      "You can contact TravelEx through phone, WhatsApp, or the inquiry form. The support number is 03 111 444 192.",
  },
  {
    question: "Is TravelEx a reliable travel company?",
    answer:
      "TravelEx has been serving travelers for many years and focuses on customer satisfaction, safety, clear guidance, and reliable travel support.",
  },
]

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <main className="bg-[#F8FAFC]">
      {/* Page Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1600&auto=format&fit=crop"
          alt="TravelEx FAQ"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-slate-950/45 to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto max-w-[1340px] px-4 py-7 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="max-w-4xl">
            <p className="font-poppins text-[8px] font-bold uppercase tracking-[0.22em] text-[#00AEEF] sm:text-[12px]">
              FAQ
            </p>

            <h1 className="mt-1 font-fredoka text-[17px] font-semibold leading-[1.08] text-white sm:mt-2 sm:text-[46px] sm:uppercase sm:leading-[1.1] lg:text-[54px]">
              <span className="sm:hidden">Travel Questions</span>
              <span className="hidden sm:inline">
                Answers Before You Travel
              </span>
            </h1>

            <p className="mt-1 max-w-3xl font-poppins text-[9px] font-medium leading-4 text-white/85 sm:mt-3 sm:text-base sm:leading-7">
              <span className="sm:hidden">
                Quick answers before booking.
              </span>

              <span className="hidden sm:inline">
                Quick answers about packages, bookings, payments, visas, and
                support.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="bg-[#F8FAFC] pb-8 pt-4 sm:pb-20 sm:pt-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-4 text-center sm:mb-12">
            <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.24em] text-[#00AEEF] sm:mb-3 sm:text-sm">
              Help Center
            </p>

            <h2 className="font-fredoka text-[18px] font-semibold leading-[1.08] text-slate-950 sm:text-4xl md:text-5xl">
              <span className="sm:hidden">Common Questions</span>
              <span className="hidden sm:inline">
                Questions travelers ask most
              </span>
            </h2>

            <p className="mx-auto mt-1 max-w-3xl font-poppins text-[10px] font-medium leading-4 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">
              <span className="sm:hidden">
                Simple answers before contacting us.
              </span>

              <span className="hidden sm:inline">
                Find simple answers before choosing a package or contacting our
                team.
              </span>
            </p>
          </div>

          <div className="grid gap-2 sm:gap-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index

              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-[5px] border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left sm:gap-4 sm:py-4"
                  >
                    <span className="font-poppins text-[11.5px] font-semibold leading-5 text-slate-950 sm:text-base">
                      {faq.question}
                    </span>

                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[5px] bg-sky-50 text-[10px] text-[#00AEEF] shadow-sm transition-transform duration-300 sm:h-8 sm:w-8 sm:text-xs ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <FaChevronDown />
                    </span>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-4 pb-4 font-poppins text-[11px] font-medium leading-5 text-slate-600 sm:text-sm sm:leading-6">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-5 rounded-[5px] bg-white p-4 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:mt-8 sm:p-6">
            <h3 className="font-fredoka text-[21px] font-semibold leading-tight text-slate-950 sm:text-2xl">
              Still have questions?
            </h3>

            <p className="mx-auto mt-1.5 max-w-2xl font-poppins text-[11.5px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-7">
              Contact TravelEx support or continue your inquiry on WhatsApp.
            </p>

            <div className="mt-4 flex flex-col justify-center gap-2 sm:mt-5 sm:flex-row sm:gap-3">
              <a
                href="tel:03111444192"
                className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-slate-200 bg-white px-5 py-2.5 font-poppins text-xs font-semibold text-slate-900 transition-colors duration-300 hover:bg-slate-950 hover:text-white sm:px-6 sm:py-3 sm:text-sm"
              >
                <FaPhoneAlt />
                Call Now
              </a>

              <a
                href="https://wa.me/923111444192"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition-colors duration-300 hover:bg-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
              >
                <FaWhatsapp />
                WhatsApp
              </a>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition-colors duration-300 hover:bg-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
              >
                Contact Page
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default FAQPage