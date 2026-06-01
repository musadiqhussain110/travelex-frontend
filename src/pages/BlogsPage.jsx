import { Link } from "react-router-dom"
import { FaArrowRight, FaCalendarAlt } from "react-icons/fa"
import { blogs } from "../data/blogs"

const BlogsPage = () => {
  return (
    <main className="bg-[#F8FAFC]">
      {/* Page Hero */}
      <section className="relative overflow-hidden bg-slate-950 py-16 text-white sm:py-20">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          alt="Travel Blogs"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.24em] !text-[#00AEEF] sm:text-[14px]">
            Travel Blogs
          </p>

          <h1 className="max-w-4xl text-[34px] !font-medium leading-[1.12] tracking-[-0.01em] !text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] sm:text-5xl lg:text-[56px]">
            TRAVEL SMARTER WITH EXPERT GUIDES
          </h1>

          <p className="mt-4 max-w-3xl text-sm font-medium leading-7 !text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)] sm:text-base lg:text-lg">
            Simple tips for Umrah, visas, tours, hotels, and stress-free travel
            planning.
          </p>
        </div>
      </section>

      {/* Blogs Grid */}
      <section className="py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 sm:mb-12">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#00AEEF] sm:text-sm">
              Latest Articles
            </p>

            <h2 className="text-3xl font-medium leading-tight text-slate-950 sm:text-4xl md:text-5xl">
              Latest travel insights
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 !text-slate-600 md:text-base">
              Quick guides to help you choose better packages, prepare
              documents, and plan your trip confidently.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <article
                key={blog.id}
                className="group overflow-hidden rounded-[5px] bg-white shadow-md shadow-slate-200/70 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute left-4 top-4 rounded-[5px] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#00AEEF] shadow-md">
                    {blog.tag}
                  </div>
                </div>

                <div className="p-5">
                  <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <FaCalendarAlt className="text-[#FF6B00]" />
                    <span>{blog.category}</span>
                  </div>

                  <h3 className="text-xl font-medium leading-tight text-slate-950">
                    {blog.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 !text-slate-600">
                    {blog.excerpt}
                  </p>

                  <Link
                    to={`/blogs/${blog.id}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#FF6B00] transition-colors duration-300 hover:text-[#00AEEF]"
                  >
                    Read More
                    <FaArrowRight className="text-xs" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default BlogsPage