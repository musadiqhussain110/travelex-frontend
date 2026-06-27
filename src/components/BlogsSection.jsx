import { Link } from "react-router-dom"
import {
  FaArrowRight,
  FaTag,
  FaRegClock,
  FaRegCalendarAlt,
} from "react-icons/fa"
import { blogs } from "../data/blogs"
import Reveal from "./Reveal"

const homeBlogs = blogs.slice(0, 3)

const cardRowClass =
  "-mx-4 flex gap-4 overflow-x-auto px-4 pb-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-3 lg:gap-8"

const Meta = ({ date, readTime }) => {
  if (!date && !readTime) return null

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-poppins text-[12px] font-medium text-slate-400">
      {date && (
        <span className="inline-flex items-center gap-1.5">
          <FaRegCalendarAlt className="text-[11px] text-[#00AEEF]" />
          {date}
        </span>
      )}

      {readTime && (
        <span className="inline-flex items-center gap-1.5">
          <FaRegClock className="text-[11px] text-[#00AEEF]" />
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
          <div className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 font-poppins text-[11px] font-bold uppercase tracking-[0.24em] text-[#00AEEF] sm:text-[12px] sm:tracking-[0.18em]">
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
            <div key={blog.id} className="min-w-[82%] sm:min-w-0">
              <Reveal delay={index * 0.12} className="h-full">
                <Link
                  to={`/blogs/${blog.id}`}
                  className="group flex h-full cursor-pointer flex-col transition-transform duration-500 hover:-translate-y-2"
                  aria-label={`Read ${blog.title}`}
                >
                  <article className="flex h-full flex-col">
                    {/* Image window */}
                    <div className="relative">
                      <div className="h-[240px] overflow-hidden rounded-[20px] shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 to-transparent" />
                      </div>

                      {/* Floating category pill */}
                      <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 font-poppins text-[10px] font-bold uppercase tracking-[0.16em] text-[#00AEEF] shadow-sm backdrop-blur">
                        <FaTag className="text-[9px]" />
                        {blog.tag}
                      </span>
                    </div>

                    {/* Overlapping white panel */}
                    <div className="relative z-10 mx-4 -mt-14 flex flex-1 flex-col rounded-[16px] border border-slate-100 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition-all duration-500 group-hover:border-[#FF6B00]/30 group-hover:shadow-[0_20px_50px_rgba(255,107,0,0.16)]">
                      <Meta date={blog.date} readTime={blog.readTime} />

                      <h3 className="mt-2.5 line-clamp-2 font-fredoka text-[20px] font-semibold leading-snug text-slate-950 transition-colors duration-300 group-hover:text-[#00AEEF]">
                        {blog.title}
                      </h3>

                      {blog.excerpt && (
                        <p className="mt-2 line-clamp-2 font-poppins text-[13px] font-medium leading-6 text-slate-500">
                          {blog.excerpt}
                        </p>
                      )}

                      <div className="mt-auto flex items-center justify-between gap-4 pt-4">
                        <span className="font-poppins text-sm font-bold text-[#FF6B00] transition-colors duration-300 group-hover:text-[#00AEEF]">
                          Read More
                        </span>

                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#00AEEF]/15 bg-[#00AEEF]/10 text-[#00AEEF] transition-all duration-300 group-hover:translate-x-1 group-hover:border-[#FF6B00] group-hover:bg-[#FF6B00] group-hover:text-white group-hover:shadow-[0_12px_30px_rgba(255,107,0,0.35)]">
                          <FaArrowRight className="text-xs" />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              </Reveal>
            </div>
          ))}
        </div>

        <div className="mt-1 text-center md:hidden">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 rounded-[5px] border border-slate-200 bg-white px-5 py-3 font-poppins text-sm font-semibold text-slate-800"
          >
            View All Blogs
            <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default BlogsSection