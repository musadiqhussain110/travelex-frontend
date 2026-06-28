import { useState } from "react"

import HeroV2 from "../components/hero/HeroV2"
import UmrahPackages from "../components/UmrahPackages"
import CustomTours from "../components/CustomTours"
import TrustSection from "../components/TrustSection"
import Footer from "../components/Footer"
import Blogs from "../components/BlogsSection"
import FAQ from "../components/FAQSection.jsx"
import LeadInquiryModal from "../components/common/LeadInquiryModal"

const Home = () => {
  const [leadModal, setLeadModal] = useState({
    isOpen: false,
    serviceType: "general",
    source: "homepage",
    title: "Plan Your Trip",
    packageRef: null,
    tourRef: null,
    visaRef: null,
    defaultMessage: "",
  })

  const openLeadModal = ({
    serviceType = "general",
    source = "homepage",
    title = "Plan Your Trip",
    packageRef = null,
    tourRef = null,
    visaRef = null,
    defaultMessage = "",
  }) => {
    setLeadModal({
      isOpen: true,
      serviceType,
      source,
      title,
      packageRef,
      tourRef,
      visaRef,
      defaultMessage,
    })
  }

  const closeLeadModal = () => {
    setLeadModal((prev) => ({
      ...prev,
      isOpen: false,
    }))
  }

  return (
    <>
      <div className="bg-[#F8FAFC]">
        <HeroV2 onOpenLeadModal={openLeadModal} />

        <UmrahPackages onOpenLeadModal={openLeadModal} />
        <CustomTours onOpenLeadModal={openLeadModal} />
        <TrustSection />
        <Blogs />
        <FAQ />
        <Footer />
      </div>

      <LeadInquiryModal
        isOpen={leadModal.isOpen}
        onClose={closeLeadModal}
        serviceType={leadModal.serviceType}
        source={leadModal.source}
        title={leadModal.title}
        packageRef={leadModal.packageRef}
        tourRef={leadModal.tourRef}
        visaRef={leadModal.visaRef}
        defaultMessage={leadModal.defaultMessage}
      />
    </>
  )
}

export default Home