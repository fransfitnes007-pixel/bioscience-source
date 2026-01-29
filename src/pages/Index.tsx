import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { WhatWeDoSection } from "@/components/home/WhatWeDoSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { TrustSection } from "@/components/home/TrustSection";
import { COASection } from "@/components/home/COASection";
import { WhyWeStartedSection } from "@/components/home/WhyWeStartedSection";
import { FAQSection } from "@/components/home/FAQSection";
import { FinalCTASection } from "@/components/home/FinalCTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <StatsSection />
      <WhatWeDoSection />
      <CategoriesSection />
      <HowItWorksSection />
      <TrustSection />
      <COASection />
      <WhyWeStartedSection />
      <FAQSection />
      <FinalCTASection />
    </Layout>
  );
};

export default Index;
