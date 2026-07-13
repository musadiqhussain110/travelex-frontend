import { FaCertificate, FaHeadset, FaUsers } from "react-icons/fa"

/**
 * Premium advertisement-style banner for the top of booking/inquiry form
 * pages. Dark gradient card with a large watermark icon, glass-style trust
 * badges, and a stamped headline — built to feel like a real ad placement,
 * not a plain info card. Content (copy, icon, accent) is supplied per page.
 */
const FormPromoBanner = ({
  eyebrow,
  titleStart,
  highlight,
  titleEnd,
  tagline,
  icon: Icon,
  accent = "#00AEEF",
}) => {
  return (
    <div className="relative mb-5 overflow-hidden rounded-[20px] bg-gradient-to-br from-[#0b2a4a] via-[#0c2e50] to-[#081b30] px-5 py-7 shadow-[0_18px_45px_rgba(11,42,74,0.35)] sm:mb-7 sm:px-10 sm:py-10">
      <style>{`
        @keyframes promoBannerFadeUp {
          0%   { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes promoBannerStampIn {
          0%   { opacity: 0; transform: translateY(18px) scale(0.94); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes promoBannerWatermarkIn {
          0%   { opacity: 0; transform: scale(0.85) rotate(-8deg); }
          100% { opacity: 1; transform: scale(1) rotate(-8deg); }
        }

        .promo-banner-fade {
          animation: promoBannerFadeUp 0.6s ease-out both;
        }

        .promo-banner-stamp {
          animation: promoBannerStampIn 0.7s ease-out 0.15s both;
        }

        .promo-banner-watermark {
          animation: promoBannerWatermarkIn 0.9s ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .promo-banner-fade,
          .promo-banner-stamp,
          .promo-banner-watermark {
            animation: none !important;
          }
        }
      `}</style>

      {/* Ambient glow blobs */}
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full opacity-25 blur-3xl"
        style={{ backgroundColor: accent }}
      />
      <div className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-[#FF6B00]/20 blur-3xl" />

      {/* Faint grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      {/* Large watermark icon */}
      {Icon && (
        <div
          className="promo-banner-watermark pointer-events-none absolute -right-4 bottom-0 hidden text-[150px] leading-none opacity-[0.08] sm:block lg:text-[190px]"
          style={{ color: accent }}
        >
          <Icon />
        </div>
      )}

      <div className="relative z-10">
        <div className="promo-banner-fade mb-4 flex flex-wrap items-center gap-2 sm:mb-5 sm:gap-2.5">
          <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 backdrop-blur-sm sm:px-3 sm:py-1.5">
            <FaCertificate className="text-[10px] text-[#FF6B00] sm:text-[12px]" />
            <span className="font-poppins text-[8.5px] font-semibold text-white/90 sm:text-[10.5px]">
              IATA Certified
            </span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 backdrop-blur-sm sm:px-3 sm:py-1.5">
            <FaUsers className="text-[10px] text-[#00AEEF] sm:text-[12px]" />
            <span className="font-poppins text-[8.5px] font-semibold text-white/90 sm:text-[10.5px]">
              10,000+ Travelers Served
            </span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 backdrop-blur-sm sm:px-3 sm:py-1.5">
            <FaHeadset className="text-[10px] text-[#FF6B00] sm:text-[12px]" />
            <span className="font-poppins text-[8.5px] font-semibold text-white/90 sm:text-[10.5px]">
              24/7 Support
            </span>
          </div>
        </div>

        <p
          className="promo-banner-fade mb-1.5 font-poppins text-[10px] font-bold uppercase tracking-[0.16em] sm:mb-2 sm:text-[12px]"
          style={{ color: accent }}
        >
          {eyebrow}
        </p>

        <h2 className="flex flex-wrap items-center gap-2 font-fredoka text-[22px] font-semibold uppercase leading-[1.1] text-white sm:gap-3 sm:text-[34px]">
          <span className="promo-banner-fade">{titleStart}</span>

          <span className="promo-banner-stamp rounded-[5px] bg-[#FF6B00] px-2.5 py-1 leading-none text-white shadow-[0_8px_18px_rgba(255,107,0,0.4)] sm:px-3.5 sm:py-1.5">
            {highlight}
          </span>

          {titleEnd && <span className="promo-banner-fade">{titleEnd}</span>}
        </h2>

        {tagline && (
          <p className="promo-banner-fade mt-2 max-w-lg font-poppins text-[10.5px] font-medium leading-5 text-white/70 sm:mt-3 sm:text-sm sm:leading-6">
            {tagline}
          </p>
        )}
      </div>
    </div>
  )
}

export default FormPromoBanner