import { useState } from "react"
import { Link } from "react-router-dom"
import { FaArrowRight, FaChevronDown } from "react-icons/fa"
import Reveal from "./Reveal"

const faqs = [
  {
    question: "What Umrah packages does TravelEx offer?",
    answer:
      "TravelEx offers budget-friendly, family, premium, and customized Umrah packages with hotel guidance, visa assistance, travel support, and WhatsApp consultation.",
  },
  {
    question: "Can TravelEx customize an Umrah package for my family?",
    answer:
      "Yes. TravelEx can customize your Umrah package according to your family size, travel dates, hotel preference, room sharing, budget, and comfort level.",
  },
  {
    question: "Does TravelEx provide international tour packages?",
    answer:
      "Yes. TravelEx provides international tour packages and customized travel plans based on your destination, hotel preference, activities, budget, and travel dates.",
  },
  {
    question: "Can TravelEx help with visa applications?",
    answer:
      "Yes. TravelEx provides visa guidance and assistance for different destinations. Final visa approval depends on the embassy or consulate.",
  },
  {
    question: "How can I book a package with TravelEx?",
    answer:
      "You can open any package detail page and click Book Now. You can also contact TravelEx through WhatsApp or phone for booking guidance.",
  },
  {
    question: "How can I contact TravelEx for travel support?",
    answer:
      "You can contact TravelEx through phone, WhatsApp, or the inquiry form. The support number is 03 111 444 192.",
  },
]

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section className="bg-white py-12 sm:py-20">
      <div className="mx-auto max-w-[920px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-10 text-center">
            <p className="mb-3 font-poppins text-[12px] font-bold uppercase tracking-[0.24em] text-[#00AEEF]">
              FAQ
            </p>

            <h2 className="font-fredoka text-[32px] font-semibold leading-tight text-slate-950 sm:text-[44px]">
              Frequently Asked Questions
            </h2>

            <p className="mx-auto mt-3 max-w-2xl font-poppins text-sm font-medium leading-7 text-slate-600 sm:text-base">
              Quick answers about Umrah packages, visa support, international
              tours and TravelEx booking assistance.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="grid gap-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index

              return (
                <div
                  key={faq.question}
                  className={`overflow-hidden rounded-[12px] border bg-[#F8FAFC] shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition-all duration-300 ${
                    isOpen
                      ? "border-[#FF6B00]/30 bg-white"
                      : "border-slate-100 hover:border-[#00AEEF]/25 hover:bg-white"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                  >
                    <span className="font-poppins text-[15px] font-semibold leading-6 text-slate-950 sm:text-base">
                      {faq.question}
                    </span>

                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs shadow-sm transition-all duration-300 ${
                        isOpen
                          ? "rotate-180 bg-[#FF6B00]/10 text-[#FF6B00]"
                          : "bg-white text-[#00AEEF]"
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
                      <p className="px-5 pb-5 font-poppins text-sm font-medium leading-7 text-slate-600 sm:px-6">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mt-8 rounded-[12px] border border-slate-100 bg-[#F8FAFC] p-5 text-center shadow-[0_8px_24px_rgba(15,23,42,0.04)] sm:p-6">
            <h3 className="font-fredoka text-[24px] font-semibold text-slate-950">
              Still have questions?
            </h3>

            <p className="mx-auto mt-2 max-w-2xl font-poppins text-sm font-medium leading-7 text-slate-600">
              Contact TravelEx support at{" "}
              <span className="font-bold text-slate-950">03 111 444 192</span>{" "}
              or continue your inquiry on WhatsApp.
            </p>

            <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/faq"
                className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-[#00AEEF]/30 bg-white px-5 py-3 font-poppins text-sm font-semibold text-[#00AEEF] transition hover:border-[#FF6B00] hover:text-[#FF6B00]"
              >
                View All FAQs
                <FaArrowRight className="text-xs" />
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-[5px] bg-[#FF6B00] px-5 py-3 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default FAQSection