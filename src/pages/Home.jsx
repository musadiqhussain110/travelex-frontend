import Hero from "../components/Hero"
import UmrahPackages from "../components/UmrahPackages"
import CustomTours from "../components/CustomTours"
import TrustSection from "../components/TrustSection"
import BlogsSection from "../components/BlogsSection"
import FAQSection from "../components/FAQSection"
import ContactSection from "../components/ContactSection"
import TestimonialsSection from "../components/TestimonialsSection"
const Home = () => {
  return (
    <>
      <Hero />
      <UmrahPackages />
      <CustomTours />
      <TrustSection />
      <TestimonialsSection />
      <BlogsSection />
      <FAQSection />
      <ContactSection />
    </>
  )
}

export default Home