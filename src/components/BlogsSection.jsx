import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FaArrowRight, FaCalendarAlt } from "react-icons/fa"
import { blogs } from "../data/blogs"

const BrandName = () => (
  <span className="font-semibold">
    <span className="text-[#FF6B00]">Travel</span>
    <span className="text-[#00AEEF]">Ex</span>
  </span>
)

const BlogsSection = () => {
  const [index, setIndex] = useState(0)
  const [visibleCards, setVisibleCards] = useState(1)

  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCards(4)
      } else if (window.innerWidth >= 768) {
        setVisibleCards(2)
      } else {
        setVisibleCards(1)
      }
    }

    updateVisibleCards()
    window.addEventListener("resize", updateVisibleCards)

    return () => window.removeEventListener("resize", updateVisibleCards)
  }, [])

  const maxIndex = Math.max(blogs.length - visibleCards, 0)

  useEffect(() => {
    if (index > maxIndex) {
      setIndex(maxIndex)
    }
  }, [index, maxIndex])

  const canGoLeft = index > 0
  const canGoRight = index < maxIndex

  const nextSlide = () => {
    if (canGoRight) {
      setIndex((prev) => prev + 1)
    }
  }

  const prevSlide = () => {
    if (canGoLeft) {
      setIndex((prev) => prev - 1)
    }
  }

  return (
    <section id="blogs" className="bg-[#F8FAFC] py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-12 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-3 text-[#00AEEF]">Travel Blogs</p>

            <h2 className="text-slate-950">Travel tips before you plan</h2>

            <p className="mt-4 max-w-3xl text-slate-600">
              Helpful guides from <BrandName /> about international
              destinations, Umrah packages, visa support, local tours, and
              travel planning.
            </p>
          </div>

          <Link
            to="/blogs"
            className="hidden rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-900 transition-colors duration-300 hover:border-[#00AEEF] hover:text-[#00AEEF] md:inline-flex"
          >
            View All Blogs
          </Link>
        </div>

        <div className="relative px-7 md:px-0">
          {maxIndex > 0 && canGoLeft && (
            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-0 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xl font-medium text-slate-900 shadow-lg transition-colors duration-300 hover:bg-[#00AEEF] hover:text-white md:-left-5 md:h-10 md:w-10 md:text-2xl"
              aria-label="Previous blog"
            >
              ‹
            </button>
          )}

          {maxIndex > 0 && canGoRight && (
            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-0 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xl font-medium text-slate-900 shadow-lg transition-colors duration-300 hover:bg-[#00AEEF] hover:text-white md:-right-5 md:h-10 md:w-10 md:text-2xl"
              aria-label="Next blog"
            >
              ›
            </button>
          )}

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${index * (100 / visibleCards)}%)`,
              }}
            >
              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="min-w-full px-1 md:min-w-[50%] md:px-3 lg:min-w-[25%]"
                >
                  <article className="group h-full overflow-hidden rounded-[1.5rem] bg-white shadow-md shadow-slate-200/70 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

                      <div className="badge-label absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-[#00AEEF] shadow-md">
                        {blog.tag}
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-400">
                        <FaCalendarAlt className="text-[#FF6B00]" />
                        <span>{blog.date || blog.category}</span>
                      </div>

                      <h3 className="text-slate-950">{blog.title}</h3>

                      <p className="mt-3 text-sm leading-6 text-slate-600">
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
                </div>
              ))}
            </div>
          </div>
        </div>

        {maxIndex > 0 && (
          <div className="mt-5 flex justify-center gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, dotIndex) => (
              <button
                type="button"
                key={dotIndex}
                onClick={() => setIndex(dotIndex)}
                className={`h-2 rounded-full transition-all ${
                  index === dotIndex ? "w-8 bg-[#00AEEF]" : "w-2 bg-slate-300"
                }`}
                aria-label={`Go to blog slide ${dotIndex + 1}`}
              />
            ))}
          </div>
        )}

        <div className="mt-6 text-center md:hidden">
          <Link
            to="/blogs"
            className="inline-flex rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-900 transition-colors duration-300 hover:border-[#00AEEF] hover:text-[#00AEEF]"
          >
            View All Blogs
          </Link>
        </div>
      </div>
    </section>
  )
}

export default BlogsSection