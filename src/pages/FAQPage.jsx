import { useState } from "react"
import { FaChevronDown, FaPhoneAlt, FaWhatsapp } from "react-icons/fa"
import { Link } from "react-router-dom"

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
      <section className="relative overflow-hidden bg-slate-950 py-16 text-white sm:py-20">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1600&auto=format&fit=crop"
          alt="TravelEx FAQ"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.24em] !text-[#00AEEF] sm:text-[14px]">
            FAQ
          </p>

          <h1 className="max-w-4xl text-[34px] !font-medium leading-[1.12] tracking-[-0.01em] !text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] sm:text-5xl lg:text-[56px]">
            ANSWERS BEFORE YOU TRAVEL
          </h1>

          <p className="mt-4 max-w-3xl text-sm font-medium leading-7 !text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)] sm:text-base lg:text-lg">
            Quick answers about packages, bookings, payments, visas, and support.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-8 text-center sm:mb-12">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#00AEEF] sm:text-sm">
              Help Center
            </p>

            <h2 className="text-3xl font-medium leading-tight text-slate-950 sm:text-4xl md:text-5xl">
              Questions travelers ask most
            </h2>

            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 !text-slate-600 md:text-base">
              Find simple answers before choosing a package or contacting our
              team.
            </p>
          </div>

          <div className="grid gap-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index

              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-[5px] border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                  >
                    <span className="text-sm font-semibold text-slate-950 sm:text-base">
                      {faq.question}
                    </span>

                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[5px] bg-sky-50 text-xs text-[#00AEEF] shadow-sm transition-transform duration-300 ${
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
                      <p className="px-4 pb-4 text-sm leading-6 !text-slate-600">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 rounded-[5px] bg-white p-6 text-center shadow-md shadow-slate-200/70">
            <h3 className="text-2xl font-medium text-slate-950">
              Still have questions?
            </h3>

            <p className="mx-auto mt-2 max-w-2xl text-sm leading-7 !text-slate-600">
              Contact TravelEx support or continue your inquiry on WhatsApp.
            </p>

            <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="tel:03111444192"
                className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-900 transition-colors duration-300 hover:bg-slate-950 hover:text-white"
              >
                <FaPhoneAlt />
                Call Now
              </a>

              <a
                href="https://wa.me/923111444192"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#00AEEF]"
              >
                <FaWhatsapp />
                WhatsApp
              </a>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-[5px] bg-[#FF6B00] px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#00AEEF]"
              >
                Contact Page
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default FAQPage