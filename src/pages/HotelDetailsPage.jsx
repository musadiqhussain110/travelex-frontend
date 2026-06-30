import { Link, useParams } from "react-router-dom"
import {
  FaArrowLeft,
  FaArrowRight,
  FaBed,
  FaCheckCircle,
  FaClock,
  FaHotel,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaStar,
  FaTag,
  FaUsers,
  FaWhatsapp,
} from "react-icons/fa"

import Footer from "../components/Footer"

import hotelHero2 from "../assets/Hotels/Hotel6.jpg"
import hotelHero3 from "../assets/Hotels/Hotel5.jpg"
import hotelHero4 from "../assets/Hotels/makkahHotel4.jpg"

const hotels = [
  {
    id: "marriott-hotel",
    name: "Marriott Hotel",
    location: "Islamabad",
    price: "from PKR 56,235 / night",
    image: hotelHero2,
    stars: 3,
    type: "City Hotel",
    shortDescription:
      "A comfortable hotel option suitable for business travel, family stay, and city-based trips with TravelEx booking guidance.",
    overview:
      "This hotel option is suitable for travelers who need a comfortable stay, reliable booking guidance, and support before final confirmation. TravelEx can assist with availability, room type, final price, and booking process based on travel dates.",
    highlights: [
      "Suitable for city stay",
      "Business and family travel support",
      "Room options available on request",
      "Final quote based on travel dates",
    ],
    facilities: ["WiFi", "Breakfast", "Laundry", "Room Service"],
    roomOptions: ["Standard Room", "Deluxe Room", "Family Room"],
    suitableFor: ["Business travel", "Family stay", "City stay"],
    note:
      "Final hotel price may vary based on travel dates, room category, number of guests, meal plan, availability, and supplier policy.",
  },
  {
    id: "family-stay-hotel",
    name: "Family Stay Hotel",
    location: "Makkah / Madinah options",
    price: "Custom quote available",
    image: hotelHero4,
    stars: 4,
    type: "Family Stay",
    shortDescription:
      "A family-friendly hotel option for Umrah travelers who need room sharing, flexible stay, and hotel guidance near Haram areas.",
    overview:
      "This option is designed for families and Umrah travelers who need hotel support in Makkah and Madinah. TravelEx can guide you with hotel distance, room sharing, family rooms, and availability according to your travel dates.",
    highlights: [
      "Family-friendly stay options",
      "Makkah and Madinah guidance",
      "Room sharing support",
      "Near Haram options on request",
    ],
    facilities: ["Family Rooms", "Near Haram Options", "Flexible Stay"],
    roomOptions: ["Quad Room", "Triple Room", "Double Room", "Family Room"],
    suitableFor: ["Families", "Umrah travelers", "Group stay"],
    note:
      "Hotel distance, room type, and price depend on selected dates, availability, and preferred hotel category.",
  },
  {
    id: "budget-hotel-options",
    name: "Budget Hotel Options",
    location: "Dubai / Turkey / Baku",
    price: "Based on travel dates",
    image: hotelHero3,
    stars: 5,
    type: "International Stay",
    shortDescription:
      "International hotel options for travelers looking for budget-friendly stays in popular destinations with TravelEx assistance.",
    overview:
      "This hotel option is suitable for international travelers looking for stay support in destinations such as Dubai, Turkey, Baku, and other travel locations. TravelEx can help with destination-based hotel recommendations and quote confirmation.",
    highlights: [
      "International hotel support",
      "Budget-based hotel guidance",
      "Custom stay recommendations",
      "Quote based on destination and dates",
    ],
    facilities: ["Breakfast Options", "Consultant Support", "Flexible Budget"],
    roomOptions: ["Budget Room", "Standard Room", "Deluxe Room"],
    suitableFor: ["International tours", "Budget trips", "Family travel"],
    note:
      "Final price depends on destination, travel season, room type, hotel category, number of guests, and supplier availability.",
  },
]

const bookingSteps = [
  {
    title: "Share stay details",
    description:
      "Tell us your destination, travel dates, number of guests, room preference, and budget.",
  },
  {
    title: "Check availability",
    description:
      "TravelEx checks suitable hotel options according to destination, dates, and comfort level.",
  },
  {
    title: "Get final quote",
    description:
      "You receive a quote based on hotel category, room type, meal plan, and availability.",
  },
  {
    title: "Confirm booking",
    description:
      "After confirmation, TravelEx guides you with payment, documents, and booking support.",
  },
]

const faqs = [
  {
    question: "Is the hotel price fixed?",
    answer:
      "Hotel prices may change based on travel dates, room type, destination, season, number of guests, and availability.",
  },
  {
    question: "Can TravelEx suggest hotels according to my budget?",
    answer:
      "Yes. TravelEx can suggest suitable hotel options according to your destination, budget, travel dates, and comfort preference.",
  },
  {
    question: "Can I request family rooms?",
    answer:
      "Yes. You can request family rooms, quad rooms, triple rooms, or custom room sharing options depending on hotel availability.",
  },
]

const getHotelWhatsappLink = (hotel) =>
  `https://wa.me/923111444192?text=${encodeURIComponent(
    `Assalamualaikum TravelEx, I need guidance about ${hotel.name} in ${hotel.location}.`
  )}`

const HotelDetailsPage = () => {
  const { id } = useParams()
  const hotel = hotels.find((item) => item.id === id)

  if (!hotel) {
    return (
      <main className="bg-[#F8FAFC]">
        <section className="bg-[#F8FAFC] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-[1180px]">
            <div className="rounded-[12px] border border-slate-100 bg-white p-5 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-8">
              <h1 className="font-fredoka text-[24px] font-semibold text-slate-950 sm:text-[34px]">
                Hotel not found
              </h1>

              <p className="mx-auto mt-2 max-w-2xl font-poppins text-[11.5px] font-medium leading-5 text-slate-600 sm:mt-3 sm:text-sm sm:leading-7">
                The hotel option you are looking for does not exist or may have
                been moved.
              </p>

              <Link
                to="/hotels"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:mt-6 sm:px-6 sm:py-3 sm:text-sm"
              >
                <FaArrowLeft className="text-[10px] sm:text-xs" />
                Back to Hotels
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    )
  }

  const quickFacts = [
    {
      label: "Location",
      value: hotel.location || "Available",
      icon: FaMapMarkerAlt,
    },
    {
      label: "Hotel Type",
      value: hotel.type || "Hotel",
      icon: FaHotel,
    },
    {
      label: "Category",
      value: `${hotel.stars} Star`,
      icon: FaStar,
    },
    {
      label: "Quote",
      value: hotel.price || "On request",
      icon: FaClock,
    },
  ]

  return (
    <main className="bg-[#F8FAFC]">
      {/* Detail Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-slate-950/45 to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto max-w-[1340px] px-4 py-7 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="max-w-4xl">
            <Link
              to="/hotels"
              className="mb-2 inline-flex items-center gap-1.5 font-poppins text-[9px] font-semibold text-white/75 transition hover:text-[#00AEEF] sm:mb-6 sm:gap-2 sm:text-sm"
            >
              <FaArrowLeft className="text-[8px] sm:text-xs" />
              Back to hotel options
            </Link>

            <div className="mb-2 flex flex-wrap items-center gap-1.5 sm:mb-4 sm:gap-3">
              <span className="inline-flex h-[27px] items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 font-poppins text-[7.5px] font-bold uppercase tracking-[0.14em] text-[#00AEEF] backdrop-blur sm:h-auto sm:gap-2 sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.16em]">
                <FaTag className="text-[8px] sm:text-[10px]" />
                {hotel.type}
              </span>

              <span className="inline-flex h-[27px] items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 font-poppins text-[8.5px] font-semibold text-white/85 backdrop-blur sm:h-auto sm:gap-2 sm:px-4 sm:py-2 sm:text-xs">
                <FaStar className="text-[#FF6B00]" />
                {hotel.stars} Star
              </span>
            </div>

            <h1 className="font-fredoka text-[18px] font-semibold leading-[1.08] text-white sm:text-[46px] sm:uppercase sm:leading-[1.1] lg:text-[54px]">
              {hotel.name}
            </h1>

            <p className="mt-1 max-w-3xl font-poppins text-[9px] font-medium leading-4 text-white/85 sm:mt-4 sm:text-base sm:leading-7">
              <span className="sm:hidden">Stay and quote support.</span>

              <span className="hidden sm:inline">{hotel.shortDescription}</span>
            </p>

            <div className="mt-3 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:gap-3">
              <Link
  to={`/booking/hotels/${hotel.id}`}
  className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
>
  Book Now
  <FaArrowRight className="text-[10px] sm:text-xs" />
</Link>

              <a
                href={getHotelWhatsappLink(hotel)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
              >
                <FaWhatsapp />
                Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="relative z-20 -mt-4 bg-transparent sm:-mt-8">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-2 rounded-[12px] border border-slate-100 bg-white p-2.5 shadow-[0_14px_36px_rgba(15,23,42,0.09)] sm:grid-cols-2 sm:gap-3 sm:p-4 lg:grid-cols-4">
            {quickFacts.map((item) => {
              const Icon = item.icon

              return (
                <div
                  key={item.label}
                  className="rounded-[5px] bg-[#F8FAFC] p-2.5 sm:p-4"
                >
                  <Icon className="text-[13px] text-[#00AEEF] sm:text-xl" />

                  <p className="mt-1.5 font-poppins text-[7px] font-bold uppercase tracking-[0.14em] text-slate-400 sm:mt-3 sm:text-[10px] sm:tracking-[0.16em]">
                    {item.label}
                  </p>

                  <p className="mt-0.5 line-clamp-2 font-poppins text-[9px] font-semibold leading-3.5 text-slate-950 sm:mt-1 sm:text-sm sm:leading-6">
                    {item.value}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Details */}
      <section className="bg-[#F8FAFC] py-8 sm:py-14">
        <div className="mx-auto grid max-w-[1440px] gap-5 px-4 sm:px-6 lg:grid-cols-[1fr_360px] lg:gap-6 lg:px-8">
          {/* Detail Content */}
          <div className="grid gap-4 sm:gap-6">
            {/* Overview */}
            <div className="rounded-[12px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-7">
              <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.24em] text-[#00AEEF] sm:mb-2 sm:text-[12px] sm:tracking-[0.18em]">
                Hotel Overview
              </p>

              <h2 className="font-fredoka text-[20px] font-semibold leading-[1.08] text-slate-950 sm:text-[36px]">
                Comfortable stay with TravelEx support
              </h2>

              <p className="mt-2 font-poppins text-[11.5px] font-medium leading-5 text-slate-600 sm:mt-3 sm:text-base sm:leading-8">
                {hotel.overview}
              </p>

              <div className="mt-4 grid gap-2 sm:mt-5 sm:grid-cols-3 sm:gap-3">
                {hotel.suitableFor.map((item) => (
                  <p
                    key={item}
                    className="flex items-center gap-2 rounded-[5px] bg-[#F8FAFC] px-3.5 py-2.5 font-poppins text-[11.5px] font-semibold text-slate-700 sm:px-4 sm:py-3 sm:text-sm"
                  >
                    <FaUsers className="shrink-0 text-[#00AEEF]" />
                    {item}
                  </p>
                ))}
              </div>
            </div>

            {/* Highlights and Facilities */}
            <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
              <div className="rounded-[12px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-6">
                <h2 className="font-fredoka text-[21px] font-semibold text-slate-950 sm:text-[26px]">
                  Hotel Highlights
                </h2>

                <div className="mt-3 grid gap-2 sm:mt-5 sm:gap-3">
                  {hotel.highlights.map((item) => (
                    <p
                      key={item}
                      className="flex items-start gap-2.5 rounded-[5px] bg-[#F8FAFC] px-3.5 py-2.5 font-poppins text-[11px] font-semibold leading-5 text-slate-700 sm:gap-3 sm:px-4 sm:py-3 sm:text-sm sm:leading-6"
                    >
                      <FaCheckCircle className="mt-1 shrink-0 text-[12px] text-[#00AEEF] sm:text-base" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              <div className="rounded-[12px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-6">
                <h2 className="font-fredoka text-[21px] font-semibold text-slate-950 sm:text-[26px]">
                  Facilities
                </h2>

                <div className="mt-3 grid gap-2 sm:mt-5 sm:gap-3">
                  {hotel.facilities.map((item) => (
                    <p
                      key={item}
                      className="flex items-start gap-2.5 rounded-[5px] bg-[#F8FAFC] px-3.5 py-2.5 font-poppins text-[11px] font-semibold leading-5 text-slate-700 sm:gap-3 sm:px-4 sm:py-3 sm:text-sm sm:leading-6"
                    >
                      <FaCheckCircle className="mt-1 shrink-0 text-[12px] text-[#FF6B00] sm:text-base" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Room Options */}
            <div className="rounded-[12px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-7">
              <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.24em] text-[#00AEEF] sm:mb-2 sm:text-[12px] sm:tracking-[0.18em]">
                Room Options
              </p>

              <h2 className="font-fredoka text-[20px] font-semibold leading-[1.08] text-slate-950 sm:text-[30px]">
                Available room preferences
              </h2>

              <div className="mt-4 grid gap-2 sm:mt-5 sm:grid-cols-3 sm:gap-4">
                {hotel.roomOptions.map((room) => (
                  <div
                    key={room}
                    className="rounded-[5px] bg-[#F8FAFC] p-3.5 sm:p-5"
                  >
                    <FaBed className="text-lg text-[#00AEEF] sm:text-xl" />

                    <p className="mt-2 font-poppins text-xs font-semibold text-slate-950 sm:mt-3 sm:text-sm">
                      {room}
                    </p>

                    <p className="mt-1 font-poppins text-[10.5px] font-medium leading-5 text-slate-500 sm:text-xs sm:leading-6">
                      Subject to availability and hotel policy.
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Process */}
            <div className="rounded-[12px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-7">
              <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.24em] text-[#00AEEF] sm:mb-2 sm:text-[12px] sm:tracking-[0.18em]">
                Booking Process
              </p>

              <h2 className="font-fredoka text-[20px] font-semibold leading-[1.08] text-slate-950 sm:text-[30px]">
                How hotel booking works
              </h2>

              <div className="mt-4 grid gap-2 sm:mt-5 sm:gap-4">
                {bookingSteps.map((step, index) => (
                  <div
                    key={step.title}
                    className="grid gap-2 rounded-[5px] border border-slate-100 bg-[#F8FAFC] p-3.5 sm:grid-cols-[auto_1fr] sm:gap-3 sm:p-4"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF6B00]/10 font-poppins text-xs font-bold text-[#FF6B00] sm:h-10 sm:w-10 sm:text-sm">
                      {index + 1}
                    </span>

                    <div>
                      <h3 className="font-fredoka text-[17px] font-semibold text-slate-950 sm:text-[20px]">
                        {step.title}
                      </h3>

                      <p className="mt-1 font-poppins text-[11px] font-medium leading-5 text-slate-600 sm:text-sm sm:leading-7">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Note */}
            <div className="rounded-[12px] border border-[#FF6B00]/15 bg-orange-50 p-4 sm:p-6">
              <div className="flex gap-2.5 sm:gap-3">
                <FaInfoCircle className="mt-1 shrink-0 text-sm text-[#FF6B00] sm:text-base" />

                <div>
                  <h3 className="font-fredoka text-[20px] font-semibold leading-tight text-slate-950 sm:text-[22px]">
                    Important pricing note
                  </h3>

                  <p className="mt-1.5 font-poppins text-[11px] font-semibold leading-5 text-orange-800 sm:mt-2 sm:text-sm sm:leading-7">
                    {hotel.note}
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-[12px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-7">
              <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.24em] text-[#00AEEF] sm:mb-2 sm:text-[12px] sm:tracking-[0.18em]">
                Common Questions
              </p>

              <h2 className="font-fredoka text-[20px] font-semibold leading-[1.08] text-slate-950 sm:text-[30px]">
                Before you request a hotel quote
              </h2>

              <div className="mt-4 grid gap-2 sm:mt-5 sm:gap-3">
                {faqs.map((faq) => (
                  <div
                    key={faq.question}
                    className="rounded-[5px] bg-[#F8FAFC] p-3.5 sm:p-4"
                  >
                    <h3 className="font-poppins text-[12px] font-bold text-slate-950 sm:text-sm">
                      {faq.question}
                    </h3>

                    <p className="mt-1.5 font-poppins text-[11px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-7">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Quote Sidebar */}
          <aside className="h-fit lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-[12px] border border-slate-100 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.08)]">
              <div className="relative h-36 overflow-hidden sm:h-44">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />

                <div className="absolute bottom-3 left-4 right-4 sm:bottom-4">
                  <p className="font-poppins text-[8.5px] font-bold uppercase tracking-[0.16em] text-white/65 sm:text-[10px]">
                    Selected Hotel
                  </p>

                  <h3 className="mt-1 font-fredoka text-[21px] font-semibold leading-tight text-white sm:text-[24px]">
                    {hotel.name}
                  </h3>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <p className="font-poppins text-[8.5px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:text-[10px]">
                  Starting / Quote
                </p>

                <p className="mt-1 font-poppins text-[22px] font-semibold leading-tight text-[#FF6B00] sm:text-[24px]">
                  {hotel.price}
                </p>

                <p className="mt-2 font-poppins text-[11px] font-medium leading-5 text-slate-500 sm:text-xs sm:leading-6">
                  Final price depends on travel dates, guests, room type, meal
                  plan, hotel category, and availability.
                </p>

                <div className="mt-4 grid gap-2 sm:mt-5 sm:gap-3">
                  <Link
  to={`/booking/hotels/${hotel.id}`}
  className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
>
  Book Now
  <FaArrowRight className="text-[10px] sm:text-xs" />
</Link>

                  <a
                    href={getHotelWhatsappLink(hotel)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
                  >
                    <FaWhatsapp />
                    WhatsApp Inquiry
                  </a>

                  <a
                    href="tel:03111444192"
                    className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-slate-200 bg-white px-5 py-2.5 font-poppins text-xs font-semibold text-slate-900 transition hover:border-[#00AEEF] hover:text-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
                  >
                    <FaPhoneAlt />
                    Call Now
                  </a>
                </div>

                <div className="mt-4 rounded-[5px] bg-[#F8FAFC] p-3.5 sm:mt-5 sm:p-4">
                  <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.16em] text-[#00AEEF] sm:text-[11px]">
                    Need custom hotel help?
                  </p>

                  <p className="mt-1.5 font-poppins text-[11px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-7">
                    Share your destination, dates, guests, room preference, and
                    budget. TravelEx can guide you with suitable hotel options.
                  </p>
                </div>

                <div className="mt-4 grid gap-2 sm:mt-5 sm:gap-3">
                  {[
                    "Hotel quote support",
                    "Family stay guidance",
                    "WhatsApp consultation",
                  ].map((item) => (
                    <p
                      key={item}
                      className="flex items-center gap-2 font-poppins text-[11.5px] font-semibold text-slate-700 sm:text-sm"
                    >
                      <FaCheckCircle className="text-[#00AEEF]" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default HotelDetailsPage