const TrustBar = () => {
  const stats = [
    "Trusted Travel Experts",
    "Umrah Packages",
    "Customized Tours",
    "Visa Assistance",
    "24/7 WhatsApp Support",
  ]

  return (
    <section className="bg-white py-6 shadow-sm">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 text-center md:grid-cols-5">
        {stats.map((item) => (
          <div key={item} className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">{item}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TrustBar