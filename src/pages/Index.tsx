import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustBadgesSection } from "@/components/home/TrustBadgesSection";
import { WhatWeDoSection } from "@/components/home/WhatWeDoSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { WhyResurrectedSection } from "@/components/home/WhyResurrectedSection";
import { COASection } from "@/components/home/COASection";
import { WhyWeStartedSection } from "@/components/home/WhyWeStartedSection";
import { FAQSection } from "@/components/home/FAQSection";
import { FinalCTASection } from "@/components/home/FinalCTASection";
import { ResearchDisclaimerSection } from "@/components/home/ResearchDisclaimerSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <TrustBadgesSection />
      <WhatWeDoSection />
      <CategoriesSection />
      <WhyResurrectedSection />
      <COASection />
      <WhyWeStartedSection />
      <FAQSection />
      <FinalCTASection />
      <ResearchDisclaimerSection />
    </Layout>
  );
};

export default Index;
