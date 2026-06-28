import { useState } from "react"
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
  FaPaperPlane,
  FaCheckCircle,
} from "react-icons/fa"

import Footer from "../components/Footer"
import AppSelect from "../components/common/AppSelect"
import { publicApi } from "../services/publicApi"
import contactHero from "../assets/contact/contact.jpg"

const initialForm = {
  name: "",
  email: "",
  phone: "",
  interestedIn: "Umrah Package",
  travelDate: "",
  message: "",
  companyWebsite: "",
}

const interestedOptions = [
  "Umrah Package",
  "Customized Tour",
  "Visa Assistance",
  "Hotel Booking",
  "Car Rental",
  "General Travel Consultation",
]

const inputClass =
  "w-full rounded-[5px] border border-slate-200 bg-white px-3 py-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10 sm:px-4 sm:py-3.5 sm:text-sm"

const labelClass =
  "mb-1.5 block font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:mb-2 sm:text-xs"

const contactItems = [
  {
    title: "Phone",
    value: "03 111 444 192",
    href: "tel:03111444192",
    icon: FaPhoneAlt,
    iconClass: "bg-[#00AEEF]/10 text-[#00AEEF]",
  },
  {
    title: "WhatsApp",
    value: "Quick Inquiry",
    href: "https://wa.me/923111444192",
    icon: FaWhatsapp,
    iconClass: "bg-[#25D366]/10 text-[#25D366]",
    external: true,
  },
  {
    title: "Email",
    value: "info@travelex.pk",
    href: "mailto:info@travelex.pk",
    icon: FaEnvelope,
    iconClass: "bg-[#FF6B00]/10 text-[#FF6B00]",
  },
]

const ContactPage = () => {
  const [formData, setFormData] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const whatsappMessage = encodeURIComponent(
    "Assalamualaikum TravelEx, I want travel consultation."
  )

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setError("")
    setSuccess("")
  }

  const handleInterestedChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      interestedIn: value,
    }))

    setError("")
    setSuccess("")
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setSuccess("")
    setError("")

    if (!formData.name.trim()) {
      setError("Please enter your full name.")
      return
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.")
      return
    }

    if (!formData.phone.trim()) {
      setError("Please enter your phone or WhatsApp number.")
      return
    }

    if (!formData.message.trim()) {
      setError("Please write a short message about your travel requirement.")
      return
    }

    try {
      setLoading(true)

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: `Travel Inquiry - ${formData.interestedIn}`,
        message: `
Interested In: ${formData.interestedIn}
Travel Month / Date: ${formData.travelDate || "Not specified"}

Message:
${formData.message.trim()}
        `.trim(),
        source: "contact-page",
        pageUrl: window.location.href,
        companyWebsite: formData.companyWebsite,
      }

      await publicApi.createContactInquiry(payload)

      setSuccess(
        "Your inquiry has been submitted successfully. TravelEx admin team can now view it in the CRM dashboard."
      )

      setFormData(initialForm)
    } catch (err) {
      console.error("Contact form submission error:", err)

      setError(
        err.message ||
          "We couldn't submit your inquiry right now. Please try again or contact us on WhatsApp."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="bg-[#F8FAFC]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <img
          src={contactHero}
          alt="Contact TravelEx"
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-[center_85%]"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-slate-950/45 to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto max-w-[1340px] px-4 py-7 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="max-w-4xl">
            <p className="font-poppins text-[8px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] sm:text-[12px] sm:tracking-[0.1em]">
              Contact TravelEx
            </p>

            <h1 className="mt-1 font-fredoka text-[17px] font-semibold leading-[1.08] text-white sm:mt-2 sm:text-[46px] sm:uppercase sm:leading-[1.1] lg:text-[54px]">
              <span className="sm:hidden">Plan Your Trip</span>
              <span className="hidden sm:inline">Ready to plan your trip?</span>
            </h1>

            <p className="mt-1 max-w-3xl font-poppins text-[9px] font-medium leading-4 text-white/85 sm:mt-3 sm:text-base sm:leading-7">
              <span className="sm:hidden">
                Umrah, tours, visa and hotel support.
              </span>

              <span className="hidden sm:inline">
                Share your travel needs and our team will guide you with Umrah
                packages, tours, visa support, hotel booking, car rental, and
                travel consultation.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="bg-[#F8FAFC] pb-8 pt-4 sm:pb-16 sm:pt-10 lg:pb-20">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            {/* Form */}
            <div className="overflow-hidden rounded-[12px] border border-slate-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <div className="border-b border-slate-100 bg-white px-4 py-4 sm:px-8 sm:py-7">
                <p className="font-poppins text-[8.5px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] sm:text-xs sm:tracking-[0.1em]">
                  Quick Inquiry
                </p>

                <h2 className="mt-1.5 font-fredoka text-[20px] font-semibold leading-[1.08] text-slate-950 sm:mt-2 sm:text-4xl">
                  Get travel help today
                </h2>

                <p className="mt-1.5 max-w-2xl font-poppins text-[10.5px] font-medium leading-5 text-slate-600 sm:mt-3 sm:text-base sm:leading-7">
                  Send your details and we’ll suggest the best travel option.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="grid gap-4 p-4 sm:p-8">
                {/* Honeypot */}
                <input
                  type="text"
                  name="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                  className="hidden"
                  tabIndex="-1"
                  autoComplete="off"
                />

                {success && (
                  <div className="flex items-start gap-3 rounded-[5px] border border-green-200 bg-green-50 px-4 py-3 font-poppins text-[11.5px] font-semibold leading-5 text-green-700 sm:text-sm">
                    <FaCheckCircle className="mt-0.5 shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                {error && (
                  <div className="rounded-[5px] border border-red-200 bg-red-50 px-4 py-3 font-poppins text-[11.5px] font-semibold leading-5 text-red-700 sm:text-sm">
                    {error}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Phone / WhatsApp</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+92 300 1234567"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className={inputClass}
                    />
                  </div>

                  <AppSelect
                    label="Interested In"
                    value={formData.interestedIn}
                    onChange={handleInterestedChange}
                    placeholder="Select service"
                    options={interestedOptions}
                  />
                </div>

                <div>
                  <label className={labelClass}>Travel Month / Date</label>
                  <input
                    type="text"
                    name="travelDate"
                    value={formData.travelDate}
                    onChange={handleChange}
                    placeholder="Example: July 2026 / Flexible dates"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Your Message</label>
                  <textarea
                    rows="5"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your destination, budget, travelers, preferred dates, or special requirements..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-5 py-3 font-poppins text-xs font-semibold text-white transition-colors duration-300 hover:bg-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-70 sm:px-6 sm:py-4 sm:text-sm"
                  >
                    <FaPaperPlane className="text-xs transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:text-sm" />
                    {loading ? "Sending..." : "Send Message"}
                  </button>

                  <a
                    href={`https://wa.me/923111444192?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-5 py-3 font-poppins text-xs font-semibold text-white transition-colors duration-300 hover:bg-[#00AEEF] sm:px-6 sm:py-4 sm:text-sm"
                  >
                    <FaWhatsapp />
                    WhatsApp Us
                  </a>
                </div>
              </form>
            </div>

            {/* Contact Info */}
            <aside className="h-fit rounded-[12px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-8 lg:sticky lg:top-24">
              <p className="font-poppins text-[8.5px] font-bold uppercase tracking-[0.08em] text-[#FF6B00] sm:text-xs sm:tracking-[0.1em]">
                Contact Details
              </p>

              <h2 className="mt-1.5 font-fredoka text-[21px] font-semibold leading-tight text-slate-950 sm:mt-2 sm:text-3xl">
                TravelEx Air Services
              </h2>

              <p className="mt-1.5 font-poppins text-[11.5px] font-medium leading-5 text-slate-600 sm:mt-3 sm:text-sm sm:leading-7">
                Contact our team for travel consultation, package details,
                booking guidance, and support.
              </p>

              <div className="mt-4 grid gap-3 sm:mt-6">
                {contactItems.map((item) => {
                  const Icon = item.icon

                  return (
                    <a
                      key={item.title}
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noreferrer" : undefined}
                      className="flex items-start gap-3 rounded-[5px] border border-slate-100 bg-[#F8FAFC] p-3 transition hover:border-[#00AEEF]/25 hover:bg-sky-50 sm:gap-4 sm:p-4"
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[5px] text-sm sm:h-11 sm:w-11 sm:text-base ${item.iconClass}`}
                      >
                        <Icon />
                      </span>

                      <div>
                        <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:text-xs sm:tracking-[0.1em]">
                          {item.title}
                        </p>

                        <p className="mt-0.5 font-poppins text-[12px] font-semibold text-slate-950 sm:mt-1 sm:text-base">
                          {item.value}
                        </p>
                      </div>
                    </a>
                  )
                })}

                <div className="flex items-start gap-3 rounded-[5px] border border-slate-100 bg-[#F8FAFC] p-3 sm:gap-4 sm:p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[5px] bg-[#00AEEF]/10 text-sm text-[#00AEEF] sm:h-11 sm:w-11 sm:text-base">
                    <FaMapMarkerAlt />
                  </span>

                  <div>
                    <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:text-xs sm:tracking-[0.1em]">
                      Address
                    </p>

                    <p className="mt-0.5 font-poppins text-[11.5px] font-semibold leading-5 text-slate-800 sm:mt-1 sm:text-sm sm:leading-7">
                      TravelEx Air Services, Shakeel Plaza, Opposite Islamia
                      College, University Road, Peshawar.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-[5px] border border-orange-100 bg-orange-50 p-3.5 sm:mt-5 sm:p-4">
                <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-[#FF6B00] sm:text-xs sm:tracking-[0.1em]">
                  Quick Support
                </p>

                <p className="mt-1.5 font-poppins text-[11.5px] font-semibold leading-5 text-orange-800 sm:mt-2 sm:text-sm sm:leading-7">
                  For urgent travel support, WhatsApp is the fastest way to
                  contact TravelEx.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default ContactPage