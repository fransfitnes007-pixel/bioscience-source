import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { WhatWeDoSection } from "@/components/home/WhatWeDoSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { COASection } from "@/components/home/COASection";
import { WhyWeStartedSection } from "@/components/home/WhyWeStartedSection";
import { FinalCTASection } from "@/components/home/FinalCTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <WhatWeDoSection />
      <HowItWorksSection />
      <COASection />
      <WhyWeStartedSection />
      <FinalCTASection />
    </Layout>
  );
};

export default Index;
