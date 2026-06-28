import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  FaArrowRight,
  FaCertificate,
  FaChevronLeft,
  FaChevronRight,
  FaHeadset,
  FaUsers,
  FaWhatsapp,
} from "react-icons/fa"

import { bannerData } from "./bannerData"

import umrahAsset from "../../assets/hero/umrah/finals.png"
import thailandAsset from "../../assets/hero/visa/thailand.png"
import visaDocs from "../../assets/hero/visa/passport-boarding-pass1.svg"
import toursAsset from "../../assets/hero/tours/tours.png"
import consultantAsset from "../../assets/hero/consultant.png"

const SLIDE_DURATION = 4500

const updatedBannerData = [
  {
    id: "consultant",
    category: "One Click Travel Help",
    titleStart: "Plan",
    highlight: "Everything",
    titleEnd: "With Ease",
    subtitle:
      "Book Umrah, customize international tours, and get visa consultation directly through TravelEx WhatsApp support.",
    buttonText: "Talk To Consultant",
    buttonLink:
      "https://wa.me/923111444192?text=Assalamualaikum%20TravelEx%2C%20I%20need%20travel%20consultation.",
    external: true,
  },
  ...bannerData,
]

const mobileBannerText = {
  consultant: {
    eyebrow: "Travel Help",
    before: "Plan",
    highlight: "Trip",
    after: "Easy",
  },
  umrah: {
    eyebrow: "Umrah Packages",
    before: "Book",
    highlight: "Umrah",
    after: "Now",
  },
  visa: {
    eyebrow: "Visa Assistance",
    before: "Apply",
    highlight: "Visa",
    after: "Easy",
  },
  tours: {
    eyebrow: "Custom Tours",
    before: "Plan",
    highlight: "Tours",
    after: "Now",
  },
}

const mobileVectorStyles = {
  consultant:
    "absolute bottom-[0px] right-[-40px] h-[120px] w-auto max-w-none object-contain",

  umrah:
    "absolute bottom-[-25px] right-[-20px] h-[152px] w-auto max-w-none object-contain",

  visa:
    "absolute bottom-[4px] right-[-4px] z-10 h-[158px] w-auto max-w-none object-contain",

  visaDocs:
    "absolute bottom-[22px] right-[70px] z-20 w-[44px] max-w-none object-contain drop-shadow-[0_8px_12px_rgba(15,23,42,0.20)]",

  tours:
    "absolute bottom-[-36px] right-[-18px] h-[182px] w-auto max-w-none object-contain",
}

const mobileVectorAssets = {
  consultant: consultantAsset,
  umrah: umrahAsset,
  visa: thailandAsset,
  tours: toursAsset,
}

const BannerSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [travelerCount, setTravelerCount] = useState(0)

  const activeBanner = updatedBannerData[activeIndex]
  const ButtonTag = activeBanner.external ? "a" : Link

  const mobileText = mobileBannerText[activeBanner.id] || {
    eyebrow: activeBanner.category,
    before: activeBanner.titleStart,
    highlight: activeBanner.highlight,
    after: activeBanner.titleEnd,
  }

  const mobileButtonText =
    activeBanner.id === "consultant"
      ? "Chat Now"
      : activeBanner.id === "visa"
        ? "Apply Now"
        : activeBanner.id === "tours"
          ? "View Tours"
          : "Explore"

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % updatedBannerData.length)
  }

  const prevSlide = () => {
    setActiveIndex((prev) =>
      prev === 0 ? updatedBannerData.length - 1 : prev - 1
    )
  }

  useEffect(() => {
    const timer = setInterval(nextSlide, SLIDE_DURATION)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    let frame
    const start = performance.now()
    const duration = 1500
    const target = 10000

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      setTravelerCount(Math.floor(progress * target))

      if (progress < 1) {
        frame = requestAnimationFrame(step)
      }
    }

    frame = requestAnimationFrame(step)

    return () => cancelAnimationFrame(frame)
  }, [])

  const stagger = (i) => ({
    animation: `bannerFadeUp 0.6s ease-out ${i * 0.12}s both`,
  })

  const renderDots = (mobile = false) => (
    <div
      className={`absolute left-1/2 z-30 flex -translate-x-1/2 ${
        mobile ? "bottom-2 gap-1.5" : "bottom-3 gap-2"
      }`}
    >
      {updatedBannerData.map((banner, index) => (
        <button
          key={banner.id}
          type="button"
          onClick={() => setActiveIndex(index)}
          className={`overflow-hidden rounded-full transition-all duration-300 ${
            mobile
              ? activeIndex === index
                ? "h-1.5 w-7 bg-slate-300"
                : "h-1.5 w-1.5 bg-slate-300"
              : activeIndex === index
                ? "h-2 w-10 bg-slate-300"
                : "h-2 w-2 bg-slate-300 hover:bg-slate-400"
          }`}
          aria-label={`Go to banner ${index + 1}`}
        >
          {activeIndex === index && (
            <span
              key={activeIndex}
              className="banner-dot-fill block h-full rounded-full bg-[#FF6B00]"
              style={{
                animation: `bannerDotFill ${SLIDE_DURATION}ms linear forwards`,
              }}
            />
          )}
        </button>
      ))}
    </div>
  )

  const renderMobileVisual = () => {
    if (activeBanner.id === "visa") {
      return (
        <div
          key={`mobile-vector-${activeIndex}`}
          className="banner-slide-item pointer-events-none absolute inset-0 z-10"
        >
          <img
            src={thailandAsset}
            alt="Visa Assistance"
            className={mobileVectorStyles.visa}
          />

          <img
            src={visaDocs}
            alt="Passport and boarding pass"
            className={mobileVectorStyles.visaDocs}
          />
        </div>
      )
    }

    const asset = mobileVectorAssets[activeBanner.id]
    const className = mobileVectorStyles[activeBanner.id]

    if (!asset || !className) return null

    return (
      <img
        key={`mobile-vector-${activeIndex}`}
        src={asset}
        alt={activeBanner.category}
        className={`banner-slide-item pointer-events-none ${className}`}
      />
    )
  }

  return (
    <div className="relative w-full">
      <style>{`
        @keyframes bannerFadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes bannerSlideInLeft {
          from {
            opacity: 0;
            transform: translateX(34px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes bannerStampIn {
          0%   { opacity: 0; transform: scale(1.3) rotate(-3deg); }
          60%  { opacity: 1; transform: scale(0.96) rotate(0.5deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }

        @keyframes bannerAssetIn {
          from { opacity: 0; transform: translateX(46px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        @keyframes bannerFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-9px); }
        }

        @keyframes bannerDotFill {
          from { width: 0%; }
          to   { width: 100%; }
        }

        .banner-slide-item {
          animation: bannerSlideInLeft 0.55s ease-out both;
        }

        .banner-asset {
          animation:
            bannerAssetIn 0.7s ease-out both,
            bannerFloat 4.5s ease-in-out 0.7s infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .banner-asset,
          .banner-slide-item,
          [data-stagger],
          .banner-dot-fill {
            animation: none !important;
          }
        }
      `}</style>

      {/* Mobile Banner */}
      <div className="relative h-[152px] overflow-hidden rounded-[14px] bg-white shadow-[0_8px_24px_rgba(11,42,74,0.10)] md:hidden">
        {renderMobileVisual()}

        <div className="pointer-events-none absolute inset-y-0 left-0 z-[15] w-[72%] bg-gradient-to-r from-white via-white/95 to-white/10" />

        <div
          key={`mobile-content-${activeIndex}`}
          className="banner-slide-item relative z-20 flex h-full max-w-[62%] flex-col justify-center px-4 pb-7 pt-4"
        >
    <p
  data-stagger
  style={stagger(1)}
  className="hero-banner-eyebrow mb-1.5 whitespace-nowrap font-poppins text-[7.5px] font-semibold uppercase text-[#00AEEF]"
>
  {mobileText.eyebrow}
</p>
          <h2
            data-stagger
            style={stagger(2)}
            className="flex flex-nowrap items-center gap-1 font-fredoka text-[18px] font-semibold uppercase leading-none text-slate-950"
          >
            <span className="whitespace-nowrap">{mobileText.before}</span>

            <span
              className="whitespace-nowrap rounded-[5px] bg-[#FF6B00] px-1.5 py-0.5 leading-none text-white shadow-sm"
              style={{
                animation: "bannerStampIn 0.5s ease-out 0.45s both",
              }}
            >
              {mobileText.highlight}
            </span>

            <span className="whitespace-nowrap">{mobileText.after}</span>
          </h2>

          <ButtonTag
            data-stagger
            style={stagger(4)}
            {...(activeBanner.external
              ? {
                  href: activeBanner.buttonLink,
                  target: "_blank",
                  rel: "noreferrer",
                }
              : { to: activeBanner.buttonLink })}
            className="group mt-3 inline-flex w-fit items-center gap-1.5 rounded-[5px] bg-[#FF6B00] px-3 py-1.5 font-poppins text-[8.5px] font-semibold text-white shadow-[0_6px_16px_rgba(255,107,0,0.28)] transition-colors duration-300 hover:bg-[#00AEEF]"
          >
            {activeBanner.id === "consultant" && (
              <FaWhatsapp className="text-[9px]" />
            )}

            {mobileButtonText}

            <FaArrowRight className="text-[8px] transition-transform duration-300 group-hover:translate-x-1" />
          </ButtonTag>
        </div>

        {renderDots(true)}
      </div>

      {/* Desktop Banner */}
      <div className="relative hidden h-[370px] rounded-[18px] bg-white/90 px-8 shadow-[0_8px_30px_rgba(11,42,74,0.05)] backdrop-blur-[3px] md:block lg:px-14">
        <div
          key={`desktop-${activeIndex}`}
          className="banner-slide-item grid h-full items-center gap-6 md:grid-cols-[1fr_1fr]"
        >
          {/* Left Content */}
          <div className="max-w-xl">
            <div
              data-stagger
              style={stagger(0)}
              className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2"
            >
              <div className="flex items-center gap-2">
                <FaCertificate className="text-[14px] text-[#FF6B00]" />

                <span className="font-poppins text-[12px] font-semibold text-[#0b2a4a]">
                  IATA Certified
                </span>
              </div>

              <span className="hidden h-3.5 w-px bg-[#0b2a4a]/20 sm:block" />

              <div className="flex items-center gap-2">
                <FaUsers className="text-[14px] text-[#00AEEF]" />

                <span className="font-poppins text-[12px] font-semibold text-[#0b2a4a]">
                  {travelerCount.toLocaleString()}+ Travelers Served
                </span>
              </div>

              <span className="hidden h-3.5 w-px bg-[#0b2a4a]/20 sm:block" />

              <div className="flex items-center gap-2">
                <FaHeadset className="text-[14px] text-[#FF6B00]" />

                <span className="font-poppins text-[12px] font-semibold text-[#0b2a4a]">
                  24/7 Support
                </span>
              </div>
            </div>

            <p
              data-stagger
              style={stagger(1)}
             className="hero-banner-eyebrow mb-2 font-poppins text-[11px] font-bold uppercase text-[#00AEEF] lg:text-[12px]"
            >
              {activeBanner.category}
            </p>

            <h2
              data-stagger
              style={stagger(2)}
              className="flex items-center gap-3 whitespace-nowrap font-fredoka text-[38px] font-semibold uppercase leading-none text-slate-950"
            >
              <span>{activeBanner.titleStart}</span>

              <span
                className="rounded-[5px] bg-[#FF6B00] px-3 py-2 leading-none text-white shadow-sm"
                style={{
                  animation: "bannerStampIn 0.5s ease-out 0.45s both",
                }}
              >
                {activeBanner.highlight}
              </span>

              <span>{activeBanner.titleEnd}</span>
            </h2>

            <p
              data-stagger
              style={stagger(3)}
              className="mt-4 font-poppins text-[19px] font-medium text-slate-600"
            >
              {activeBanner.subtitle}
            </p>

            <div data-stagger style={stagger(4)}>
              <ButtonTag
                {...(activeBanner.external
                  ? {
                      href: activeBanner.buttonLink,
                      target: "_blank",
                      rel: "noreferrer",
                    }
                  : { to: activeBanner.buttonLink })}
                className="group mt-6 inline-flex items-center gap-2 rounded-[5px] bg-[#FF6B00] px-6 py-2.5 font-poppins text-sm font-semibold text-white shadow-[0_8px_24px_rgba(255,107,0,0.35)] transition-colors duration-300 hover:bg-[#00AEEF] hover:shadow-[0_10px_28px_rgba(0,174,239,0.35)]"
              >
                {activeBanner.id === "consultant" && (
                  <FaWhatsapp className="text-[14px]" />
                )}

                {activeBanner.buttonText}

                <FaArrowRight className="text-[12px] transition-transform duration-300 group-hover:translate-x-1" />
              </ButtonTag>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative hidden h-full min-h-[300px] md:block">
            {activeBanner.id === "consultant" && (
              <div className="banner-asset absolute right-[-100px] top-[-18px] z-20 w-[760px] max-w-none lg:right-[-150px] lg:w-[820px] xl:right-[-170px] xl:w-[880px]">
                <img
                  src={consultantAsset}
                  alt="TravelEx Consultant"
                  className="w-full max-w-none origin-center scale-[0.8] object-contain"
                />
              </div>
            )}

            {activeBanner.id === "umrah" && (
              <img
                src={umrahAsset}
                alt="Umrah Packages"
                className="banner-asset absolute bottom-[-100px] right-[10px] z-20 w-[380px] object-contain"
              />
            )}

            {activeBanner.id === "visa" && (
              <>
                <img
                  src={thailandAsset}
                  alt="Thailand Visa"
                  className="banner-asset absolute bottom-[8px] right-[20px] z-20 h-[400px] w-auto max-w-none object-contain"
                />

                <img
                  src={visaDocs}
                  alt="Passport and boarding pass"
                  className="banner-asset absolute bottom-[16px] right-[160px] z-30 w-[170px] object-contain drop-shadow-[0_18px_25px_rgba(15,23,42,0.25)]"
                  style={{ animationDelay: "0.15s, 0.85s" }}
                />
              </>
            )}

            {activeBanner.id === "tours" && (
              <img
                src={toursAsset}
                alt="Tours"
                className="banner-asset absolute bottom-[-80px] right-[0px] z-20 w-[390px] object-contain"
              />
            )}
          </div>
        </div>

        {renderDots(false)}
      </div>

      {/* Desktop arrows only */}
      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-0 top-1/2 z-30 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#00AEEF] text-white shadow-lg transition-colors duration-300 hover:bg-[#FF6B00] hover:text-white md:flex"
        aria-label="Previous banner"
      >
        <FaChevronLeft />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-0 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-[#00AEEF] text-white shadow-lg transition-colors duration-300 hover:bg-[#FF6B00] hover:text-white md:flex"
        aria-label="Next banner"
      >
        <FaChevronRight />
      </button>
    </div>
  )
}

export default BannerSlider