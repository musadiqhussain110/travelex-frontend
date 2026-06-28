import { Link } from "react-router-dom"
import {
  FaArrowRight,
  FaRegCalendarAlt,
  FaRegClock,
  FaTag,
} from "react-icons/fa"

import { blogs } from "../data/blogs"
import Reveal from "./Reveal"

const homeBlogs = blogs.slice(0, 3)

const cardRowClass =
  "-mx-4 flex gap-3 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-3 lg:gap-8"

const Meta = ({ date, readTime }) => {
  if (!date && !readTime) return null

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
    </div>
  )
}

const BlogsSection = () => {
  return (
    <section id="blogs" className="bg-[#F8FAFC] pt-6 pb-3 sm:pt-8 sm:pb-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-5 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 font-poppins text-[9px] font-bold uppercase tracking-[0.1em] text-[#00AEEF] sm:text-[12px] sm:tracking-[0.12em]">
                Travel Guides
              </p>

              <h2 className="max-w-3xl font-fredoka text-[24px] font-semibold leading-tight text-slate-950 sm:text-[44px]">
                Helpful Travel Insights
              </h2>

              <p className="mt-2 max-w-2xl font-poppins text-[12px] font-medium leading-6 text-slate-600 sm:text-base sm:leading-7">
                Read practical guides about Umrah planning, international tours,
                visa support and travel preparation.
              </p>
            </div>

            <Link
              to="/blogs"
              className="hidden items-center gap-2 rounded-[5px] border border-[#FF6B00]/40 bg-white px-5 py-3 font-poppins text-sm font-semibold text-[#FF6B00] transition hover:border-[#00AEEF] hover:text-[#00AEEF] md:inline-flex"
            >
              View All Blogs
              <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </Reveal>

        <div className={cardRowClass}>
          {homeBlogs.map((blog, index) => (
            <div key={blog.id} className="min-w-[78%] sm:min-w-0">
              <Reveal delay={index * 0.08} className="h-full">
                <Link
                  to={`/blogs/${blog.id}`}
                  className="group flex h-full cursor-pointer flex-col transition-transform duration-500 hover:-translate-y-2"
                  aria-label={`Read ${blog.title}`}
                >
                  <article className="flex h-full flex-col">
                    {/* Image window */}
                    <div className="relative">
                      <div className="h-[200px] overflow-hidden rounded-[14px] shadow-[0_14px_34px_rgba(15,23,42,0.10)] sm:h-[240px] sm:rounded-[20px] sm:shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 to-transparent" />
                      </div>

                      {/* Floating category pill */}
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 font-poppins text-[7.5px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] shadow-sm backdrop-blur sm:left-4 sm:top-4 sm:px-3.5 sm:text-[10px] sm:tracking-[0.12em]">
                        <FaTag className="text-[8px] sm:text-[9px]" />
                        {blog.tag}
                      </span>
                    </div>

                    {/* Overlapping white panel */}
                    <div className="relative z-10 mx-3 -mt-10 flex flex-1 flex-col rounded-[12px] border border-slate-100 bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.08)] transition-all duration-500 group-hover:border-[#FF6B00]/30 group-hover:shadow-[0_20px_50px_rgba(255,107,0,0.16)] sm:mx-4 sm:-mt-14 sm:rounded-[16px] sm:p-5">
                      <Meta date={blog.date} readTime={blog.readTime} />

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

                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#00AEEF]/15 bg-[#00AEEF]/10 text-[#00AEEF] transition-all duration-300 group-hover:translate-x-1 group-hover:border-[#FF6B00] group-hover:bg-[#FF6B00] group-hover:text-white group-hover:shadow-[0_12px_30px_rgba(255,107,0,0.35)] sm:h-10 sm:w-10">
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

        <div className="mt-2 text-center md:hidden">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 rounded-[5px] border border-slate-200 bg-white px-4 py-2.5 font-poppins text-xs font-semibold text-slate-800"
          >
            View All Blogs
            <FaArrowRight className="text-[10px]" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default BlogsSection