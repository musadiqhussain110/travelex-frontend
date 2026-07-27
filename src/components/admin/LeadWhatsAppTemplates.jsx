import { useMemo, useState } from "react"
import {
  FaCheckCircle,
  FaCopy,
  FaCreditCard,
  FaFileAlt,
  FaKaaba,
  FaPaperPlane,
  FaReply,
  FaWhatsapp,
} from "react-icons/fa"

const formatService = (serviceType = "") => {
  const labels = {
    umrah: "Umrah",
    tour: "Tour",
    visa: "Visa",
    ticket: "Air Ticket",
    hotel: "Hotel",
    carRental: "Airport Transfer",
    contact: "Contact",
    general: "Travel Service",
  }

  return labels[serviceType] || serviceType || "Travel Service"
}

const getFirstName = (name = "") => {
  return name?.trim()?.split(" ")?.[0] || "there"
}

const getWhatsappPhone = (phone = "") => {
  return String(phone).replace(/[^\d]/g, "")
}

const getWhatsappUrl = (phone = "", message = "") => {
  const cleanPhone = getWhatsappPhone(phone)

  if (!cleanPhone) return "https://wa.me/"

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
}

const buildTemplates = (lead = {}) => {
  const firstName = getFirstName(lead.name)
  const service = formatService(lead.serviceType)
  const destination =
    lead.destinationCountry ||
    lead.destination ||
    lead.destinationCity ||
    "your selected destination"

  return [
    {
      id: "first-response",
      title: "First Response",
      description: "Send this when customer inquiry is received.",
      icon: <FaReply />,
      tone: "blue",
      message: `Assalamualaikum ${firstName}, thank you for contacting TravelEx.pk.

We have received your ${service} inquiry. Our consultant will review your requirements and guide you with the best available options.

Please share any additional details if needed, so we can assist you better.`,
    },
    {
      id: "umrah-package",
      title: "Umrah Package Response",
      description: "Use for Umrah leads and package discussion.",
      icon: <FaKaaba />,
      tone: "orange",
      message: `Assalamualaikum ${firstName}, thank you for contacting TravelEx.pk.

We have received your Umrah package inquiry. Please confirm the following details:

• Preferred travel date
• Number of adults, children, and child ages
• Departure city
• Hotel preference
• Package duration
• Budget range

Once we receive these details, our consultant will share suitable Umrah package options with you.`,
    },
    {
      id: "visa-documents",
      title: "Visa Documents Request",
      description: "Use when asking customer for visa documents.",
      icon: <FaFileAlt />,
      tone: "purple",
      message: `Assalamualaikum ${firstName}, thank you for contacting TravelEx.pk.

For your visa inquiry for ${destination}, please share the following documents/details:

• Passport copy
• CNIC copy
• Recent photograph
• Bank statement if required
• Employment/business details
• Intended travel date
• Previous travel history if available

Once received, our visa consultant will guide you about requirements, processing time, and next steps.`,
    },
    {
      id: "payment-reminder",
      title: "Payment Reminder",
      description: "Use when lead is at payment pending stage.",
      icon: <FaCreditCard />,
      tone: "green",
      message: `Assalamualaikum ${firstName}, this is a gentle reminder from TravelEx.pk.

Your ${service} booking is currently at the payment pending stage. Please confirm once payment is arranged so we can proceed with the next booking steps.

If you need any clarification, our team is available to assist you.`,
    },
    {
      id: "follow-up-reminder",
      title: "Follow-up Reminder",
      description: "Use for pending leads and scheduled follow-ups.",
      icon: <FaPaperPlane />,
      tone: "dark",
      message: `Assalamualaikum ${firstName}, hope you are doing well.

This is a follow-up from TravelEx.pk regarding your ${service} inquiry. Please let us know if you would like to proceed or need more details.

Our consultant will be happy to guide you with the best available options.`,
    },
  ]
}

const getToneClass = (tone = "blue") => {
  const tones = {
    blue: "bg-[#00AEEF]/10 text-[#00AEEF]",
    orange: "bg-orange-50 text-[#FF6B00]",
    purple: "bg-purple-50 text-purple-700",
    green: "bg-emerald-50 text-emerald-700",
    dark: "bg-slate-950 text-white",
  }

  return tones[tone] || tones.blue
}

const LeadWhatsAppTemplates = ({ lead }) => {
  const [activeTemplateId, setActiveTemplateId] = useState("first-response")
  const [copiedId, setCopiedId] = useState("")

  const templates = useMemo(() => buildTemplates(lead), [lead])

  const activeTemplate =
    templates.find((template) => template.id === activeTemplateId) ||
    templates[0]

  const handleCopy = async (template) => {
    try {
      await navigator.clipboard.writeText(template.message)
      setCopiedId(template.id)

      setTimeout(() => {
        setCopiedId("")
      }, 1800)
    } catch {
      setCopiedId("")
    }
  }

  return (
    <div className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.12em] text-[#FF6B00]">
            WhatsApp Templates
          </p>

          <h2 className="mt-1 font-fredoka text-[30px] font-semibold leading-tight text-slate-950">
            Quick Reply Center
          </h2>

          <p className="mt-1 font-poppins text-sm font-medium leading-6 text-slate-500">
            Ready-to-copy messages for faster consultant response and better
            customer conversion.
          </p>
        </div>

        <a
          href={getWhatsappUrl(lead?.phone, activeTemplate?.message)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-4 py-2.5 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
        >
          <FaWhatsapp />
          Open WhatsApp
        </a>
      </div>

      <div className="grid gap-4 xl:grid-cols-[280px_1fr]">
        <div className="grid content-start gap-2">
          {templates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => setActiveTemplateId(template.id)}
              className={`rounded-[5px] border p-4 text-left transition ${
                activeTemplateId === template.id
                  ? "border-[#00AEEF] bg-[#00AEEF]/5 shadow-[0_0_0_4px_rgba(0,174,239,0.08)]"
                  : "border-slate-100 bg-[#F8FAFC] hover:border-[#00AEEF]/40 hover:bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[5px] ${getToneClass(
                    template.tone
                  )}`}
                >
                  {template.icon}
                </span>

                <div>
                  <p className="font-poppins text-sm font-bold text-slate-950">
                    {template.title}
                  </p>

                  <p className="mt-1 font-poppins text-xs font-medium leading-5 text-slate-500">
                    {template.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="rounded-[5px] border border-orange-100 bg-orange-50 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-[#FF6B00]">
                Selected Template
              </p>

              <h3 className="mt-1 font-fredoka text-[26px] font-semibold text-slate-950">
                {activeTemplate.title}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(activeTemplate)}
              className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-white px-4 py-2.5 font-poppins text-sm font-semibold text-[#FF6B00] transition hover:bg-[#FF6B00] hover:text-white"
            >
              {copiedId === activeTemplate.id ? <FaCheckCircle /> : <FaCopy />}
              {copiedId === activeTemplate.id ? "Copied" : "Copy Message"}
            </button>
          </div>

          <div className="mt-4 rounded-[5px] border border-orange-100 bg-white p-4">
            <p className="whitespace-pre-wrap font-poppins text-sm font-medium leading-7 text-slate-700">
              {activeTemplate.message}
            </p>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => handleCopy(activeTemplate)}
              className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-slate-950 px-4 py-3 font-poppins text-sm font-semibold text-white transition hover:bg-[#FF6B00]"
            >
              <FaCopy />
              Copy WhatsApp Message
            </button>

            <a
              href={getWhatsappUrl(lead?.phone, activeTemplate?.message)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-4 py-3 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
            >
              <FaWhatsapp />
              Send on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeadWhatsAppTemplates