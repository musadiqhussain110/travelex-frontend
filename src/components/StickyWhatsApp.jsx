import { FaWhatsapp } from "react-icons/fa"

const StickyWhatsApp = () => {
  return (
    <a
      href="https://wa.me/923111444192"
      target="_blank"
      rel="noreferrer"
      className="group fixed bottom-5 right-5 z-[999] hidden h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[#25D366] text-white shadow-2xl transition-all duration-300 hover:w-44 hover:justify-start hover:px-5 lg:flex"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="shrink-0 text-3xl" />

      <span className="ml-0 w-0 overflow-hidden whitespace-nowrap text-sm font-black opacity-0 transition-all duration-300 group-hover:ml-3 group-hover:w-auto group-hover:opacity-100">
        Chat with us
      </span>
    </a>
  )
}

export default StickyWhatsApp