import { Link } from "react-router-dom"
import {
  FaArrowRight,
  FaRegCalendarAlt,
  FaRegClock,
  FaTag,
} from "react-icons/fa"

import { blogs } from "../data/blogs"
import Reveal from "../components/Reveal"
import Footer from "../components/Footer"

const Meta = ({ date, readTime, category }) => {
  if (!date && !readTime && !category) return null

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-poppins text-[9px] font-medium text-slate-400 sm:gap-x-4 sm:text-[12px]">
      {date && (
        <span className="inline-flex items-center gap-1.5">
          <FaRegCalendarAlt className="text-[9px] text-[#00AEEF] sm:text-[11px]" />
          {date}
        </span>
      )}

      {readTime && (
        <span className="inline-flex items-center gap-1.5">
          <FaRegClock className="text-[9px] text-[#00AEEF] sm:text-[11px]" />
          {readTime}
        </span>
      )}

      {!date && !readTime && category && (
        <span className="inline-flex items-center gap-1.5">
          <FaRegCalendarAlt className="text-[9px] text-[#00AEEF] sm:text-[11px]" />
          {category}
        </span>
      )}
    </div>
  )
}

const BlogsPage = () => {
  return (
    <main className="bg-[#F8FAFC]">
      {/* Page Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          alt="Travel Blogs"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-slate-950/45 to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto max-w-[1340px] px-4 py-7 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="max-w-5xl">
            <p className="mb-2 font-poppins text-[8px] font-bold uppercase tracking-[0.24em] text-[#00AEEF] sm:mb-4 sm:text-[12px] sm:tracking-[0.25em]">
              Travel Blogs
            </p>

            <h1 className="max-w-4xl font-fredoka text-[18px] font-semibold leading-[1.08] text-white sm:text-[46px] sm:uppercase sm:leading-[1.1] lg:text-[54px]">
              Travel smarter with expert guides
            </h1>

            <p className="mt-1 max-w-3xl font-poppins text-[9px] font-medium leading-4 text-white/85 sm:mt-4 sm:text-base sm:leading-7">
              <span className="sm:hidden">Quick travel tips and guides.</span>

              <span className="hidden sm:inline">
                Simple tips for Umrah, visas, tours, hotels, and stress-free
                travel planning.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Blogs Section */}
      <section className="bg-[#F8FAFC] py-8 sm:py-14">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-5 sm:mb-10">
              <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.24em] text-[#00AEEF] sm:mb-3 sm:text-xs sm:tracking-[0.25em]">
                Latest Articles
              </p>

              <h2 className="font-fredoka text-[20px] font-semibold leading-[1.08] text-slate-950 sm:text-[36px] md:text-[44px]">
                Latest travel insights
              </h2>

              <p className="mt-2 max-w-3xl font-poppins text-[10.5px] font-medium leading-5 text-slate-600 sm:mt-4 sm:text-sm sm:leading-7 md:text-base">
                Quick guides to help you choose better packages, prepare
                documents, and plan your trip confidently.
              </p>
            </div>
          </Reveal>

          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:auto-rows-fr sm:grid-cols-2 sm:gap-7 sm:overflow-visible sm:px-0 lg:grid-cols-3 lg:gap-8">
            {blogs.map((blog, index) => (
              <div
                key={blog.id}
                className="w-[86%] min-w-[86%] shrink-0 snap-start sm:w-auto sm:min-w-0"
              >
                <Reveal delay={index * 0.08} className="h-full">
                  <Link
                    to={`/blogs/${blog.id}`}
                    className="group flex h-full flex-col transition-transform duration-500 hover:-translate-y-1"
                    aria-label={`Read ${blog.title}`}
                  >
                    <article className="flex h-full flex-col">
                      {/* Image */}
                      <div className="relative">
                        <div className="h-[200px] overflow-hidden rounded-[14px] shadow-[0_14px_32px_rgba(15,23,42,0.10)] sm:h-[240px] sm:rounded-[16px] sm:shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 to-transparent" />
                        </div>

                        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 font-poppins text-[7.5px] font-bold uppercase tracking-[0.14em] text-[#00AEEF] shadow-sm backdrop-blur sm:left-4 sm:top-4 sm:px-3.5 sm:text-[10px] sm:tracking-[0.16em]">
                          <FaTag className="text-[8px] sm:text-[9px]" />
                          {blog.tag}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="relative z-10 mx-3 -mt-10 flex flex-1 flex-col rounded-[12px] border border-slate-100 bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.08)] transition-shadow duration-500 group-hover:shadow-[0_18px_44px_rgba(0,174,239,0.13)] sm:mx-4 sm:-mt-14 sm:rounded-[16px] sm:p-5">
                        <Meta
                          date={blog.date}
                          readTime={blog.readTime}
                          category={blog.category}
                        />

                        <h3 className="mt-2 line-clamp-2 font-fredoka text-[17px] font-semibold leading-snug text-slate-950 transition-colors duration-300 group-hover:text-[#00AEEF] sm:mt-2.5 sm:text-[20px]">
                          {blog.title}
                        </h3>

                        {blog.excerpt && (
                          <p className="mt-1.5 line-clamp-2 font-poppins text-[10.5px] font-medium leading-5 text-slate-500 sm:mt-2 sm:text-[13px] sm:leading-6">
                            {blog.excerpt}
                          </p>
                        )}

                        <div className="mt-auto flex items-center justify-between gap-4 pt-3 sm:pt-4">
                          <span className="font-poppins text-[11px] font-bold text-[#FF6B00] transition-colors duration-300 group-hover:text-[#00AEEF] sm:text-sm">
                            Read More
                          </span>

                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#00AEEF]/15 bg-[#00AEEF]/10 text-[#00AEEF] transition-all duration-300 group-hover:border-[#FF6B00]/40 group-hover:bg-[#FF6B00] group-hover:text-white sm:h-10 sm:w-10">
                            <FaArrowRight className="text-[10px] sm:text-xs" />
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default BlogsPage