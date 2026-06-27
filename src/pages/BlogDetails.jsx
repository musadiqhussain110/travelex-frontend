import { Link, useParams } from "react-router-dom"
import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendarAlt,
  FaCheckCircle,
  FaPhoneAlt,
  FaRegClock,
  FaTag,
  FaWhatsapp,
} from "react-icons/fa"

import { blogs } from "../data/blogs"
import Footer from "../components/Footer"

const getWhatsappLink = (blog) =>
  `https://wa.me/923111444192?text=${encodeURIComponent(
    `Assalamualaikum TravelEx, I read your blog "${blog.title}" and need travel guidance. Please guide me.`
  )}`

const BlogDetails = () => {
  const { id } = useParams()
  const blog = blogs.find((item) => item.id === id)

  if (!blog) {
    return (
      <main className="bg-[#F8FAFC]">
        <section className="bg-[#F8FAFC] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-[1180px]">
            <div className="rounded-[12px] border border-slate-100 bg-white p-5 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-8">
              <h1 className="font-fredoka text-[24px] font-semibold text-slate-950 sm:text-[34px]">
                Blog not found
              </h1>

              <p className="mx-auto mt-2 max-w-2xl font-poppins text-[11.5px] font-medium leading-5 text-slate-600 sm:mt-3 sm:text-sm sm:leading-7">
                The blog article you are looking for does not exist or may have
                been moved.
              </p>

              <Link
                to="/blogs"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:mt-6 sm:px-6 sm:py-3 sm:text-sm"
              >
                <FaArrowLeft className="text-[10px] sm:text-xs" />
                Back to Blogs
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    )
  }

  const articleContent = blog.content || []

  return (
    <main className="bg-[#F8FAFC]">
      {/* Blog Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <img
          src={blog.image}
          alt={blog.title}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/72 via-slate-950/52 to-slate-950/22" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto max-w-[1340px] px-4 py-7 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="max-w-5xl">
            <Link
              to="/blogs"
              className="mb-2 inline-flex items-center gap-1.5 font-poppins text-[9px] font-semibold text-white/75 transition hover:text-[#00AEEF] sm:mb-6 sm:gap-2 sm:text-sm"
            >
              <FaArrowLeft className="text-[8px] sm:text-xs" />
              Back to blogs
            </Link>

            <div className="mb-2 flex flex-wrap items-center gap-1.5 sm:mb-4 sm:gap-3">
              <span className="inline-flex h-[27px] items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 font-poppins text-[7.5px] font-bold uppercase tracking-[0.14em] text-[#00AEEF] backdrop-blur sm:h-auto sm:gap-2 sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.16em]">
                <FaTag className="text-[8px] sm:text-[10px]" />
                {blog.tag || "Travel Guide"}
              </span>

              {blog.date && (
                <span className="inline-flex h-[27px] items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 font-poppins text-[8.5px] font-semibold text-white/85 backdrop-blur sm:h-auto sm:gap-2 sm:px-4 sm:py-2 sm:text-xs">
                  <FaCalendarAlt className="text-[#FF6B00]" />
                  {blog.date}
                </span>
              )}

              {blog.readTime && (
                <span className="inline-flex h-[27px] items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 font-poppins text-[8.5px] font-semibold text-white/85 backdrop-blur sm:h-auto sm:gap-2 sm:px-4 sm:py-2 sm:text-xs">
                  <FaRegClock className="text-[#FF6B00]" />
                  {blog.readTime}
                </span>
              )}
            </div>

            <h1 className="max-w-5xl font-fredoka text-[20px] font-semibold leading-[1.08] text-white sm:text-[46px] sm:uppercase sm:leading-[1.1] lg:text-[54px]">
              {blog.title}
            </h1>

            <p className="mt-1 max-w-3xl font-poppins text-[9px] font-medium leading-4 text-white/85 sm:mt-4 sm:text-base sm:leading-7">
              <span className="sm:hidden">Travel guide by TravelEx.</span>

              <span className="hidden sm:inline">
                {blog.excerpt ||
                  "Read this TravelEx guide to plan your next trip with better clarity and confidence."}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Article */}
      <section className="bg-[#F8FAFC] py-8 sm:py-14">
        <div className="mx-auto grid max-w-[1440px] gap-5 px-4 sm:px-6 lg:grid-cols-[1fr_360px] lg:gap-6 lg:px-8">
          <article className="overflow-hidden rounded-[12px] border border-slate-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <img
              src={blog.image}
              alt={blog.title}
              className="hidden h-72 w-full object-cover sm:block"
            />

            <div className="p-4 sm:p-8">
              <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.24em] text-[#00AEEF] sm:mb-2 sm:text-[12px] sm:tracking-[0.18em]">
                Article Guide
              </p>

              <h2 className="font-fredoka text-[21px] font-semibold leading-[1.08] text-slate-950 sm:text-[34px]">
                {blog.title}
              </h2>

              {blog.excerpt && (
                <p className="mt-3 rounded-[5px] bg-[#F8FAFC] p-3.5 font-poppins text-[12px] font-semibold leading-6 text-slate-700 sm:mt-5 sm:p-5 sm:text-lg sm:leading-8">
                  {blog.excerpt}
                </p>
              )}

              <div className="mt-5 grid gap-4 sm:mt-8 sm:gap-5">
                {articleContent.map((paragraph, index) => (
                  <p
                    key={index}
                    className="font-poppins text-[12px] font-medium leading-6 text-slate-600 sm:text-base sm:leading-8"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-6 rounded-[12px] border border-orange-100 bg-orange-50 p-4 sm:mt-8 sm:p-5">
                <h3 className="font-fredoka text-[21px] font-semibold leading-tight text-slate-950 sm:text-[24px]">
                  Need help planning this?
                </h3>

                <p className="mt-1.5 font-poppins text-[11.5px] font-semibold leading-5 text-orange-800 sm:mt-2 sm:text-sm sm:leading-7">
                  TravelEx can guide you with Umrah packages, visa assistance,
                  hotel booking, customized tours, and complete travel planning.
                </p>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-3">
                  <a
                    href={getWhatsappLink(blog)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
                  >
                    <FaWhatsapp />
                    Ask on WhatsApp
                  </a>

                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
                  >
                    Send Inquiry
                    <FaArrowRight className="text-[10px] sm:text-xs" />
                  </Link>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="h-fit lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-[12px] border border-slate-100 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.08)]">
              <div className="relative h-36 overflow-hidden sm:h-44">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />

                <div className="absolute bottom-3 left-4 right-4 sm:bottom-4">
                  <p className="font-poppins text-[8.5px] font-bold uppercase tracking-[0.16em] text-white/65 sm:text-[10px]">
                    TravelEx Guide
                  </p>

                  <h3 className="mt-1 line-clamp-2 font-fredoka text-[21px] font-semibold leading-tight text-white sm:text-[24px]">
                    {blog.title}
                  </h3>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <p className="font-poppins text-[8.5px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:text-[10px]">
                  Need travel guidance?
                </p>

                <h3 className="mt-1 font-fredoka text-[22px] font-semibold leading-tight text-slate-950 sm:text-[24px]">
                  Talk to TravelEx
                </h3>

                <p className="mt-2 font-poppins text-[11px] font-medium leading-5 text-slate-600 sm:text-sm sm:leading-7">
                  Contact TravelEx for Umrah packages, customized tours, visa
                  assistance, hotel support, and travel planning.
                </p>

                <div className="mt-4 grid gap-2 sm:mt-5 sm:gap-3">
                  <a
                    href={getWhatsappLink(blog)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
                  >
                    <FaWhatsapp />
                    WhatsApp
                  </a>

                  <a
                    href="tel:03111444192"
                    className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-slate-200 bg-white px-5 py-2.5 font-poppins text-xs font-semibold text-slate-900 transition hover:border-[#00AEEF] hover:text-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
                  >
                    <FaPhoneAlt />
                    Call Now
                  </a>

                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
                  >
                    Send Inquiry
                    <FaArrowRight className="text-[10px] sm:text-xs" />
                  </Link>
                </div>

                <div className="mt-4 rounded-[5px] bg-[#F8FAFC] p-3.5 sm:mt-5 sm:p-4">
                  <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.16em] text-[#00AEEF] sm:text-[11px]">
                    TravelEx Support
                  </p>

                  <div className="mt-3 grid gap-2.5">
                    {[
                      "Umrah package guidance",
                      "Visa document support",
                      "Hotel and tour planning",
                    ].map((item) => (
                      <p
                        key={item}
                        className="flex items-center gap-2 font-poppins text-[11.5px] font-semibold text-slate-700 sm:text-sm"
                      >
                        <FaCheckCircle className="shrink-0 text-[#00AEEF]" />
                        {item}
                      </p>
                    ))}
                  </div>
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

export default BlogDetails