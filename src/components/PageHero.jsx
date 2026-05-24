import { useEffect, useState } from "react"

import airplane from "../assets/airplane.jpeg"
import clockTower from "../assets/clock-tower.avif"
import kaaba from "../assets/kaaba.avif"
import madinah from "../assets/madinah.jpeg"
import naran from "../assets/Naran-Kaghan.webp"

const defaultImages = [kaaba, madinah, naran, clockTower, airplane]

const BrandName = () => (
  <span className="font-semibold">
    <span className="text-[#FF6B00]">Travel</span>
    <span className="text-[#00AEEF]">Ex</span>
  </span>
)

const formatDescription = (text) => {
  if (!text || typeof text !== "string") return text

  const parts = text.split("TravelEx")

  return parts.map((part, index) => (
    <span key={`${part}-${index}`}>
      {part}
      {index < parts.length - 1 && <BrandName />}
    </span>
  ))
}

const PageHero = ({
  eyebrow,
  title,
  mobileTitle,
  description,
  images = defaultImages,
  children,
  variant = "default",
}) => {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (!images || images.length <= 1) return

    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % images.length)
    }, 4500)

    return () => clearInterval(timer)
  }, [images])

  return (
    <section
      className={`relative overflow-visible bg-cover bg-center bg-no-repeat sm:h-[500px] ${
        variant === "car-mobile-tight" ? "h-[390px]" : "h-[420px]"
      }`}
      style={{ backgroundImage: `url(${images[active]})` }}
    >
      {images.map((img, index) => (
        <img
          key={img}
          src={img}
          alt={title || "TravelEx page background"}
          className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ${
            index === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/50" />

      <div
        className={`relative z-10 mx-auto max-w-7xl px-4 sm:px-6 sm:pt-28 ${
          variant === "car-mobile-tight"
            ? "pt-9"
            : variant === "hotel-mobile-tight"
            ? "pt-8"
            : variant === "flight-mobile-tight"
            ? "pt-8"
            : variant === "umrah-mobile-tight"
            ? "pt-8"
            : variant === "tour-mobile-tight"
            ? "pt-5"
            : "pt-14"
        }`}
      >
        {eyebrow && (
          <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.26em] text-white/80 drop-shadow-[0_3px_10px_rgba(0,0,0,0.75)] sm:mb-5 sm:text-[14px] md:text-[15px]">
            {eyebrow}
          </p>
        )}

        {title && (
          <h1 className="max-w-5xl font-serif text-[36px] font-bold leading-[1.08] tracking-[-0.035em] text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.35)] sm:text-5xl md:text-6xl lg:text-[68px]">
            <span className="sm:hidden">{mobileTitle || title}</span>
            <span className="hidden sm:inline">{title}</span>
          </h1>
        )}

        {description && (
          <p className="mt-4 hidden max-w-4xl text-sm font-medium leading-7 text-white/85 sm:block sm:text-base md:text-[17px] lg:text-lg">
            {formatDescription(description)}
          </p>
        )}
      </div>

      {children && (
        <div
          className={`absolute left-1/2 z-20 w-full max-w-6xl -translate-x-1/2 px-4 sm:bottom-[-90px] sm:px-6 ${
            variant === "car-mobile-tight"
              ? "bottom-[-115px]"
              : variant === "hotel-mobile-tight"
              ? "bottom-[-95px]"
              : variant === "flight-mobile-tight"
              ? "bottom-[-180px]"
              : variant === "tour-mobile-tight"
              ? "bottom-[-80px]"
              : "bottom-[-165px]"
          }`}
        >
          {children}
        </div>
      )}
    </section>
  )
}

export default PageHero