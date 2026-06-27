import { useMemo } from "react"
import { Link, useSearchParams } from "react-router-dom"
import {
  FaArrowRight,
  FaMapMarkerAlt,
  FaSearch,
  FaStar,
  FaTag,
  FaWhatsapp,
} from "react-icons/fa"

import Footer from "../components/Footer"

import Umrah4 from "../assets/Umrah/family.jpeg"
import Umrah5 from "../assets/Umrah/family2.jpeg"
import Umrah6 from "../assets/Umrah/family3.jpeg"
import Umrah7 from "../assets/Umrah/family4.jpeg"

import baku from "../assets/tours/baku.jpg"
import turkey from "../assets/tours/istanbul.jpg"
import malaysia from "../assets/tours/malaysia.jpg"
import customTour from "../assets/tours/dubai.jpg"

const whatsappLink =
  "https://wa.me/923111444192?text=Assalamualaikum%20TravelEx%2C%20I%20need%20guidance%20about%20travel%20packages."

const cardRowClass =
  "-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 xl:grid-cols-4"

const searchPackages = [
  {
    id: "15-days-umrah-package",
    category: "umrah",
    title: "15 Days Umrah",
    location: "Makkah & Madinah",
    price: "PKR 255,000",
    image: Umrah4,
    badge: "Economy",
    rating: "4.7",
    to: "/package/15-days-umrah-package",
    keywords: [
      "umrah",
      "15 days umrah",
      "15 days",
      "economy umrah",
      "makkah",
      "madinah",
      "kaaba",
      "affordable umrah",
    ],
  },
  {
    id: "15-days-family-umrah",
    category: "umrah",
    title: "Family Umrah",
    location: "Family-friendly stay options",
    price: "PKR 263,500",
    image: Umrah5,
    badge: "Standard",
    rating: "4.5",
    to: "/package/15-days-family-umrah",
    keywords: [
      "umrah",
      "family umrah",
      "family package",
      "standard umrah",
      "makkah",
      "madinah",
      "hotel",
    ],
  },
  {
    id: "premium-umrah-package",
    category: "umrah",
    title: "Premium Umrah",
    location: "Near Haram hotel options",
    price: "PKR 296,000",
    image: Umrah6,
    badge: "Premium",
    rating: "4.7",
    premium: true,
    to: "/package/premium-umrah-package",
    keywords: [
      "umrah",
      "premium umrah",
      "luxury umrah",
      "near haram",
      "haram hotel",
      "makkah hotel",
      "madinah",
    ],
  },
  {
    id: "custom-umrah-plan",
    category: "umrah",
    title: "Custom Umrah",
    location: "Based on your budget",
    price: "Custom Quote",
    image: Umrah7,
    badge: "Custom",
    rating: "4.9",
    to: "/package/custom-umrah-plan",
    keywords: [
      "umrah",
      "custom umrah",
      "custom package",
      "custom quote",
      "budget umrah",
      "personalized umrah",
    ],
  },
  {
    id: "baku-azerbaijan-tour",
    category: "tours",
    title: "Baku Tour",
    location: "Baku",
    price: "PKR 240,000",
    image: baku,
    badge: "Azerbaijan",
    rating: "4.8",
    to: "/tours/baku-azerbaijan-tour",
    keywords: [
      "baku",
      "azerbaijan",
      "baku tour",
      "azerbaijan tour",
      "international tour",
      "holiday",
      "family tour",
    ],
  },
  {
    id: "istanbul-turkey-tour",
    category: "tours",
    title: "Istanbul Tour",
    location: "Istanbul",
    price: "PKR 326,500",
    image: turkey,
    badge: "Turkey",
    rating: "4.9",
    to: "/tours/istanbul-turkey-tour",
    keywords: [
      "istanbul",
      "turkey",
      "turkey tour",
      "istanbul tour",
      "international tour",
      "family trip",
      "holiday",
    ],
  },
  {
    id: "kuala-lumpur-malaysia-tour",
    category: "tours",
    title: "Kuala Lumpur Tour",
    location: "Kuala Lumpur",
    price: "PKR 300,000",
    image: malaysia,
    badge: "Malaysia",
    rating: "4.8",
    to: "/tours/kuala-lumpur-malaysia-tour",
    keywords: [
      "malaysia",
      "kuala lumpur",
      "malaysia tour",
      "kuala lumpur tour",
      "international tour",
      "holiday",
    ],
  },
  {
    id: "custom-international-tour",
    category: "tours",
    title: "Custom International Tour",
    location: "Worldwide",
    price: "Custom Quote",
    image: customTour,
    badge: "Custom",
    rating: "5.0",
    to: "/tours/custom-international-tour",
    keywords: [
      "custom tour",
      "international tour",
      "worldwide",
      "customized tour",
      "family tour",
      "honeymoon",
      "holiday",
      "dubai",
    ],
  },
]

const normalize = (text = "") =>
  text
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()

const getWords = (text = "") =>
  normalize(text)
    .split(" ")
    .filter((word) => word.length > 1)

const getItemSearchText = (item) =>
  normalize(
    [
      item.title,
      item.location,
      item.price,
      item.badge,
      item.category,
      ...(item.keywords || []),
    ].join(" ")
  )

const getSearchScore = (item, query) => {
  const cleanQuery = normalize(query)
  const queryWords = getWords(cleanQuery)

  const title = normalize(item.title)
  const location = normalize(item.location)
  const badge = normalize(item.badge)
  const category = normalize(item.category)
  const searchText = getItemSearchText(item)

  if (!cleanQuery) return 0

  let score = 0

  if (title === cleanQuery) score += 180
  if (title.includes(cleanQuery)) score += 120
  if (location === cleanQuery) score += 120
  if (location.includes(cleanQuery)) score += 90
  if (badge.includes(cleanQuery)) score += 80
  if (category.includes(cleanQuery)) score += 60
  if (searchText.includes(cleanQuery)) score += 70

  queryWords.forEach((word) => {
    if (title.includes(word)) score += 30
    if (location.includes(word)) score += 25
    if (badge.includes(word)) score += 20
    if (category.includes(word)) score += 18
    if (searchText.includes(word)) score += 12
  })

  const matchedWords = queryWords.filter((word) => searchText.includes(word))

  if (matchedWords.length >= 2) {
    score += matchedWords.length * 12
  }

  return score
}

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get("q") || ""

  const results = useMemo(() => {
    const cleanQuery = normalize(query)

    if (!cleanQuery) return []

    return searchPackages
      .map((item) => ({
        ...item,
        score: getSearchScore(item, cleanQuery),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
  }, [query])

  const exactResults = results.filter(
    (item) =>
      normalize(item.title) === normalize(query) ||
      normalize(item.location) === normalize(query)
  )

  const relatedResults = results.filter(
    (item) =>
      normalize(item.title) !== normalize(query) &&
      normalize(item.location) !== normalize(query)
  )

  const popularItems = searchPackages.slice(0, 8)

  return (
    <main className="bg-[#F8FAFC]">
      {/* Search Header */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1340px] px-4 py-5 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <p className="font-poppins text-[8.5px] font-bold uppercase tracking-[0.24em] text-[#00AEEF] sm:text-[12px]">
            Search TravelEx
          </p>

          <h1 className="mt-1.5 max-w-4xl font-fredoka text-[18px] font-semibold leading-[1.08] text-slate-950 sm:mt-2 sm:text-[44px]">
            {query ? (
              <>
                Results for{" "}
                <span className="text-[#FF6B00]">“{query}”</span>
              </>
            ) : (
              "Search Umrah and tour packages"
            )}
          </h1>

          <p className="mt-1.5 max-w-2xl font-poppins text-[10px] font-medium leading-4 text-slate-600 sm:mt-3 sm:text-base sm:leading-7">
            <span className="sm:hidden">
              Find matching Umrah and tour packages.
            </span>

            <span className="hidden sm:inline">
              Exact package matches appear first. If the exact package is not
              available, the closest relevant packages are shown below.
            </span>
          </p>
        </div>
      </section>

      {/* Search Content */}
      <section className="bg-[#F8FAFC] pb-8 pt-4 sm:pb-16 sm:pt-10">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          {query && results.length > 0 && (
            <div className="mb-2 flex flex-col gap-2 md:mb-10 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.24em] text-[#00AEEF] sm:mb-2 sm:text-[12px] sm:tracking-[0.18em]">
                  Search Results
                </p>

                <h2 className="max-w-3xl font-fredoka text-[18px] font-semibold leading-[1.08] text-slate-950 sm:text-[44px]">
                  Best matching packages
                </h2>

                <p className="mt-1 max-w-2xl font-poppins text-[10px] font-medium leading-4 text-slate-600 sm:mt-1.5 sm:text-base sm:leading-7">
                  {results.length} result{results.length > 1 ? "s" : ""} found
                  for “{query}”.
                </p>
              </div>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="hidden items-center gap-2 rounded-[5px] border border-[#FF6B00]/40 bg-white px-5 py-3 font-poppins text-sm font-semibold text-[#FF6B00] transition hover:border-[#00AEEF] hover:text-[#00AEEF] md:inline-flex"
              >
                Ask for Custom Plan
                <FaWhatsapp className="text-sm" />
              </a>
            </div>
          )}

          {query && exactResults.length > 0 && (
            <div className="mb-5 sm:mb-10">
              <h3 className="mb-2 font-poppins text-[8.5px] font-bold uppercase tracking-[0.22em] text-[#00AEEF] sm:mb-4 sm:text-xs">
                Exact match
              </h3>

              <div className={cardRowClass}>
                {exactResults.map((item) => (
                  <SearchPackageCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {query && relatedResults.length > 0 && (
            <div>
              <h3 className="mb-2 font-poppins text-[8.5px] font-bold uppercase tracking-[0.22em] text-[#00AEEF] sm:mb-4 sm:text-xs">
                Related packages
              </h3>

              <div className={cardRowClass}>
                {relatedResults.map((item) => (
                  <SearchPackageCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {query && results.length === 0 && (
            <div className="rounded-[5px] border border-slate-100 bg-white p-5 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-8">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FF6B00]/10 text-[#FF6B00] sm:h-14 sm:w-14">
                <FaSearch />
              </div>

              <h2 className="mt-3 font-fredoka text-[21px] font-semibold text-slate-950 sm:mt-4 sm:text-2xl">
                No exact package found
              </h2>

              <p className="mx-auto mt-1.5 max-w-xl font-poppins text-[11.5px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-7">
                We could not find a package for “{query}”. You can still ask
                TravelEx for a custom quote through WhatsApp.
              </p>

              <a
                href={`https://wa.me/923111444192?text=${encodeURIComponent(
                  `Assalamualaikum TravelEx, I searched for "${query}" but could not find an exact package. Please guide me.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:mt-5 sm:py-3 sm:text-sm"
              >
                <FaWhatsapp />
                Ask on WhatsApp
              </a>
            </div>
          )}

          {!query && (
            <div>
              <div className="mb-2 sm:mb-10">
                <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.24em] text-[#00AEEF] sm:mb-2 sm:text-[12px] sm:tracking-[0.18em]">
                  Popular Searches
                </p>

                <h2 className="max-w-3xl font-fredoka text-[18px] font-semibold leading-[1.08] text-slate-950 sm:text-[44px]">
                  Explore popular packages
                </h2>

                <p className="mt-1 max-w-2xl font-poppins text-[10px] font-medium leading-4 text-slate-600 sm:mt-1.5 sm:text-base sm:leading-7">
                  Start with popular Umrah and international tour packages.
                </p>
              </div>

              <div className={cardRowClass}>
                {popularItems.map((item) => (
                  <SearchPackageCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          <div className="mt-2 text-center md:hidden">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-[5px] border border-slate-200 bg-white px-4 py-2.5 font-poppins text-[10.5px] font-semibold text-slate-800 shadow-sm"
            >
              Ask for Custom Plan
              <FaWhatsapp className="text-[12px] text-[#25D366]" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

const SearchPackageCard = ({ item }) => {
  return (
    <Link
      to={item.to}
      className={`group block min-w-[76%] overflow-hidden rounded-[16px] bg-slate-950 shadow-[0_18px_42px_rgba(15,23,42,0.16)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_70px_rgba(0,174,239,0.18)] sm:min-w-0 sm:rounded-[18px] sm:shadow-[0_22px_55px_rgba(15,23,42,0.18)] ${
        item.premium ? "ring-1 ring-[#FF6B00]/25" : ""
      }`}
      aria-label={`View ${item.title}`}
    >
      <div className="relative h-[305px] overflow-hidden sm:h-[360px]">
        <img
          src={item.image}
          alt={`${item.badge} ${item.title}`}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950 to-transparent sm:h-32" />

        <div className="absolute left-4 top-4 inline-flex h-[29px] items-center gap-1.5 rounded-full border border-white/25 bg-slate-950/30 px-3 font-poppins text-[8px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md sm:left-5 sm:top-5 sm:h-[36px] sm:gap-2 sm:px-4 sm:text-[10px] sm:tracking-[0.16em]">
          <FaTag className="text-[8.5px] text-[#00AEEF] sm:text-[10px]" />
          {item.badge}
        </div>

        <div className="absolute right-4 top-4 inline-flex h-[29px] items-center gap-1.5 rounded-full border border-white/20 bg-slate-950/25 px-2.5 backdrop-blur-md sm:right-5 sm:top-5 sm:h-[36px] sm:px-3">
          <FaStar className="text-[9.5px] text-[#FF6B00] sm:text-[11px]" />

          <span className="font-poppins text-[10px] font-bold leading-none text-white sm:text-[12px]">
            {item.rating}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
          <p className="flex items-center gap-2 font-fredoka text-[17px] font-semibold leading-tight text-white sm:text-[22px]">
            <FaMapMarkerAlt className="text-[10.5px] text-[#00AEEF] sm:text-[13px]" />
            {item.location}
          </p>

          <p className="mt-1 font-poppins text-[10px] font-semibold leading-4 text-white/65 sm:text-xs sm:leading-5">
            {item.title}
          </p>

          <div className="mt-2 flex items-end justify-between gap-3 sm:mt-3 sm:gap-4">
            <div>
              <p className="font-poppins text-[8px] font-bold uppercase tracking-[0.16em] text-white/45 sm:text-[9px]">
                {item.price === "Custom Quote" ? "Get a" : "From"}
              </p>

              <p className="mt-1 font-poppins text-[17px] font-medium leading-none tracking-[-0.03em] !text-[#FF6B00] sm:text-[20px]">
                {item.price}
              </p>
            </div>

            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#00AEEF]/15 bg-[#00AEEF]/15 text-sm text-white backdrop-blur-md transition-all duration-300 group-hover:border-[#FF6B00]/40 group-hover:bg-[#FF6B00] group-hover:shadow-[0_12px_30px_rgba(255,107,0,0.35)] sm:h-11 sm:w-11 sm:text-base">
              <FaArrowRight />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default SearchResultsPage