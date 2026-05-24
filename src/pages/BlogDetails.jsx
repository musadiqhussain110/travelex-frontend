import { Link, useParams } from "react-router-dom"
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaWhatsapp,
  FaPhoneAlt,
} from "react-icons/fa"
import { blogs } from "../data/blogs"

const BlogDetails = () => {
  const { id } = useParams()
  const blog = blogs.find((item) => item.id === id)

  if (!blog) {
    return (
      <main className="bg-[#F8FAFC] py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="rounded-[2rem] bg-white p-8 text-center shadow-md shadow-slate-200/70">
            <h1 className="text-3xl font-black text-slate-950">
              Blog not found
            </h1>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              The blog article you are looking for does not exist.
            </p>

            <Link
              to="/blogs"
              className="mt-6 inline-flex rounded-full bg-[#FF6B00] px-6 py-3 text-sm font-black text-white transition-colors duration-300 hover:bg-[#00AEEF]"
            >
              Back to Blogs
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-[#F8FAFC]">
      {/* Blog Hero */}
      <section className="relative overflow-hidden bg-slate-950 py-14 text-white sm:py-20">
        <img
          src={blog.image}
          alt={blog.title}
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/40" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
          <Link
            to="/blogs"
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-300 transition-colors duration-300 hover:text-[#00AEEF]"
          >
            <FaArrowLeft />
            Back to blogs
          </Link>

          <p className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-[#00AEEF]">
            {blog.tag}
          </p>

          <h1 className="text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
            {blog.title}
          </h1>

          <div className="mt-5 flex items-center gap-2 text-sm font-bold text-slate-300">
            <FaCalendarAlt className="text-[#FF6B00]" />
            <span>{blog.category}</span>
          </div>
        </div>
      </section>

      {/* Article */}
      <section className="py-12 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_0.38fr]">
          <article className="rounded-[2rem] bg-white p-6 shadow-md shadow-slate-200/70 sm:p-8">
            <img
              src={blog.image}
              alt={blog.title}
              className="mb-8 h-72 w-full rounded-[1.5rem] object-cover"
            />

            <p className="text-lg font-bold leading-8 text-slate-700">
              {blog.excerpt}
            </p>

            <div className="mt-8 grid gap-5">
              {blog.content.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-sm leading-8 text-slate-600 md:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </article>

          <aside className="h-fit rounded-[2rem] bg-white p-6 shadow-md shadow-slate-200/70 lg:sticky lg:top-28">
            <h3 className="text-xl font-black text-slate-950">
              Need travel guidance?
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              Contact TravelEx for Umrah packages, customized tours, visa
              assistance, hotel support, and travel planning.
            </p>

            <div className="mt-5 grid gap-3">
              <a
                href="https://wa.me/923111444192"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-black text-white transition-colors duration-300 hover:bg-[#00AEEF]"
              >
                <FaWhatsapp />
                WhatsApp
              </a>

              <a
                href="tel:03111444192"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-black text-slate-900 transition-colors duration-300 hover:bg-slate-950 hover:text-white"
              >
                <FaPhoneAlt />
                Call Now
              </a>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full bg-[#FF6B00] px-6 py-3 text-sm font-black text-white transition-colors duration-300 hover:bg-[#00AEEF]"
              >
                Send Inquiry
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default BlogDetails