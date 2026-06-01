import { useState } from "react"
import { Link } from "react-router-dom"
import { FaChevronDown } from "react-icons/fa"

const faqs = [
  {
    question: "What services does TravelEx offer?",
    answer:
      "TravelEx offers a wide range of travel services including tour packages, flight bookings, hotel reservations, transportation arrangements, visa assistance, travel insurance, and more. They serve both individual travelers and groups for smooth and hassle-free travel experiences.",
  },
  {
    question: "How can I book a tour or travel service with TravelEx?",
    answer:
      "You can explore available packages and services on the website. After choosing your preferred option, you can continue with the booking or inquiry process. You can also contact our customer support team by phone or WhatsApp for guidance.",
  },
  {
    question: "Are TravelEx tour packages customizable?",
    answer:
      "Yes. TravelEx offers customizable tour packages based on your travel preferences. You can request changes in destinations, itinerary, hotel options, travel dates, activities, or group requirements.",
  },
  {
    question: "How can I make payment for my booking?",
    answer:
      "TravelEx provides convenient payment options depending on the selected service and booking type. Payment methods may include card payments, bank transfer, or other available payment options. The support team can guide you during the booking process.",
  },
  {
    question: "Does TravelEx provide travel insurance?",
    answer:
      "Yes. TravelEx can assist with travel insurance options for added peace of mind during your journey. Coverage details and pricing can be discussed with the customer service team during the booking process.",
  },
  {
    question: "What happens if I need to cancel or modify my booking?",
    answer:
      "If you need to cancel or modify your booking, TravelEx recommends contacting their customer support team. Cancellation or modification may depend on the package terms, service provider policies, and booking conditions.",
  },
  {
    question: "Are there any age restrictions for TravelEx tours?",
    answer:
      "TravelEx offers tours for different types of travelers and age groups. Some tours may be suitable for all ages, while others may have restrictions due to activities or travel conditions. It is best to check the tour details or ask the support team.",
  },
  {
    question: "Can TravelEx assist with visa applications?",
    answer:
      "Yes. TravelEx provides visa assistance and guidance for different destinations. Their team can guide travelers about requirements, documents, and application steps. However, final visa approval depends on the relevant embassy or consulate.",
  },
  {
    question: "How can I contact TravelEx for queries or support?",
    answer:
      "You can contact TravelEx through our customer support number 03 111 444 192, WhatsApp, or the inquiry form on the website. Our support team can help before, during, or after your trip.",
  },
  {
    question: "Is TravelEx a reliable travel company?",
    answer:
      "TravelEx has been serving travelers for many years and focuses on customer satisfaction, safety, clear guidance, and reliable travel support. Our services cover Umrah, tours, hotels, flights, visa assistance, and customized travel planning.",
  },
]

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section id="faq" className="bg-white py-12 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mb-8 text-center sm:mb-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#00AEEF] sm:text-sm">
            FAQ
          </p>

          <h2 className="text-3xl font-medium leading-tight text-slate-950 sm:text-4xl md:text-5xl">
            Frequently asked questions
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 !text-slate-600 md:text-base">
            Got a question? We’ve got you covered, quick answers and full-on
            clarity.
          </p>
        </div>

        <div className="grid gap-3">
          {faqs.slice(0, 6).map((faq, index) => {
            const isOpen = openIndex === index

            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-[5px] border border-slate-100 bg-[#F8FAFC] shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-slate-950 sm:text-base">
                    {faq.question}
                  </span>

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[5px] bg-white text-xs text-[#00AEEF] shadow-sm transition-transform duration-300 ${
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

        <div className="mt-8 rounded-[5px] bg-[#F8FAFC] p-5 text-center shadow-sm sm:p-6">
          <h3 className="text-xl font-medium text-slate-950">
            Still have questions?
          </h3>

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-7 !text-slate-600">
            Contact TravelEx support at{" "}
            <span className="font-medium text-slate-950">03 111 444 192</span>{" "}
            or continue your inquiry on WhatsApp.
          </p>

          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/faq"
              className="inline-flex items-center justify-center rounded-[5px] border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-colors duration-300 hover:border-[#00AEEF] hover:text-[#00AEEF]"
            >
              View All FAQs
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-[5px] bg-[#FF6B00] px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#00AEEF]"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQSection