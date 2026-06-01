import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa"

const ContactPage = () => {
  return (
    <main className="bg-[#F8FAFC]">
      {/* Page Hero */}
      <section className="relative overflow-hidden bg-slate-950 py-16 text-white sm:py-20">
        <img
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c"
          alt="Contact TravelEx"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.24em] !text-white sm:text-[14px]">
            Contact{" "}
            <span>
              <span className="text-[#FF6B00]">Travel</span>
              <span className="text-[#00AEEF]">Ex</span>
            </span>
          </p>

          <h1 className="max-w-4xl text-[34px] !font-medium leading-[1.12] tracking-[-0.01em] !text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] sm:text-5xl lg:text-[56px]">
            READY TO PLAN YOUR TRIP?
          </h1>

          <p className="mt-4 max-w-3xl text-sm font-medium leading-7 !text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)] sm:text-base lg:text-lg">
            Share your travel needs and our team will guide you with the right
            package.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="bg-[#F8FAFC] pt-4 pb-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            {/* Form */}
            <div className="rounded-[5px] bg-white p-5 shadow-md shadow-slate-200/70 sm:p-8">
              <p className="eyebrow mb-3 text-[#00AEEF]">Quick Inquiry</p>

              <h2 className="text-slate-950">Get travel help today</h2>

              <p className="mt-3 !text-slate-600">
                Send your details and we’ll suggest the best package, hotel,
                flight, or tour option.
              </p>

              <form className="mt-7 grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="rounded-[5px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#00AEEF] focus:bg-white"
                  />

                  <input
                    type="tel"
                    placeholder="Phone / WhatsApp"
                    className="rounded-[5px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#00AEEF] focus:bg-white"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <select className="rounded-[5px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-600 outline-none transition focus:border-[#00AEEF] focus:bg-white">
                    <option>Interested In</option>
                    <option>Umrah Package</option>
                    <option>Customized Tour</option>
                    <option>Visa Assistance</option>
                    <option>Hotel Booking</option>
                    <option>Flight Booking</option>
                    <option>Car Rental</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Travel Month / Date"
                    className="rounded-[5px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#00AEEF] focus:bg-white"
                  />
                </div>

                <textarea
                  rows="6"
                  placeholder="Write your message, destination, budget, number of travelers, or special requirements..."
                  className="resize-none rounded-[5px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#00AEEF] focus:bg-white"
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="submit"
                    className="rounded-[5px] bg-[#FF6B00] px-6 py-4 text-sm font-semibold uppercase text-white transition-colors duration-300 hover:bg-[#00AEEF]"
                  >
                    Send Message
                  </button>

                  <a
                    href="https://wa.me/923111444192"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-6 py-4 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#00AEEF]"
                  >
                    <FaWhatsapp />
                    WhatsApp Us
                  </a>
                </div>
              </form>
            </div>

            {/* Info Card */}
            <div className="rounded-[5px] bg-slate-950 p-6 text-white shadow-2xl sm:p-8">
              <h2 className="text-3xl font-medium">TravelEx Air Services</h2>

              <p className="mt-3 text-sm leading-7 !text-slate-300">
                Reach out to TravelEx for travel consultation, package
                information, booking guidance, and support.
              </p>

              <div className="mt-7 grid gap-4">
                <a
                  href="tel:03111444192"
                  className="flex items-start gap-4 rounded-[5px] bg-white/10 p-4 transition hover:bg-white/15"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[5px] bg-[#00AEEF] text-white">
                    <FaPhoneAlt />
                  </span>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider !text-slate-400">
                      Phone
                    </p>
                    <p className="mt-1 font-semibold !text-white">
                      03 111 444 192
                    </p>
                  </div>
                </a>

                <a
                  href="https://wa.me/923111444192"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-4 rounded-[5px] bg-white/10 p-4 transition hover:bg-white/15"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[5px] bg-[#25D366] text-white">
                    <FaWhatsapp />
                  </span>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider !text-slate-400">
                      WhatsApp
                    </p>
                    <p className="mt-1 font-semibold !text-white">
                      Quick Inquiry
                    </p>
                  </div>
                </a>

                <div className="flex items-start gap-4 rounded-[5px] bg-white/10 p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[5px] bg-[#FF6B00] text-white">
                    <FaEnvelope />
                  </span>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider !text-slate-400">
                      Email
                    </p>
                    <p className="mt-1 font-semibold !text-white">
                      info@travelex.pk
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-[5px] bg-white/10 p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[5px] bg-white text-[#00AEEF]">
                    <FaMapMarkerAlt />
                  </span>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider !text-slate-400">
                      Address
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-6 !text-white">
                      TravelEx Air Services, Shakeel Plaza, Opposite Islamia
                      College, University Road, Peshawar.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-7 rounded-[5px] bg-white/10 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#00AEEF]">
                  24/7 Support
                </p>

                <p className="mt-2 text-sm leading-7 !text-slate-300">
                  TravelEx provides customer support for travel inquiries,
                  package guidance, and booking-related questions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ContactPage