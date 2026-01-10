import { Layout } from "@/components/layout/Layout";

const Terms = () => {
  return (
    <Layout>
      <div className="pt-24 lg:pt-32 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12 animate-fade-up">
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-foreground">
                Point Biosciences
              </h1>
              <h2 className="font-heading text-2xl text-muted-foreground">
                Terms and Conditions of Use
              </h2>
              <p className="font-body text-muted-foreground mt-4">
                Effective Date: January 1, 2025
              </p>
            </div>

            {/* Terms Content */}
            <div className="prose prose-invert max-w-none animate-fade-up animation-delay-100">
              <p className="font-body text-muted-foreground leading-relaxed mb-8">
                By accessing or using the website www.pointbiosciences.com ("Site"), you agree to 
                comply with and be bound by these Terms and Conditions. These Terms govern your use 
                of our Site and any services offered by Point Biosciences ("we," "us," or "our"). 
                If you do not agree with these Terms, you may not access or use the Site.
              </p>

              <section className="mb-8">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">General Overview</h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  Point Biosciences is a distributor connecting businesses that are looking for research 
                  products to third-party peptide suppliers. We do not manufacture, produce, or own any 
                  peptides or other products listed on our Site. All purchases are made directly with the 
                  third-party supplier; we act solely as a facilitator.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Eligibility</h3>
                <ul className="font-body text-muted-foreground leading-relaxed list-disc list-inside space-y-2">
                  <li>You must be at least 21 years of age.</li>
                  <li>You must be a licensed professional, researcher, or otherwise qualified to purchase 
                      peptides for in-vitro research purposes only.</li>
                </ul>
                <p className="font-body text-muted-foreground leading-relaxed mt-4">
                  By using our Site, you represent and warrant that you meet these criteria. Point Biosciences 
                  reserves the right to refuse service or terminate accounts if eligibility requirements are not met.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Use of the Site</h3>
                <ul className="font-body text-muted-foreground leading-relaxed list-disc list-inside space-y-2">
                  <li>You may use the Site for lawful purposes only.</li>
                  <li>You may view, download, or print materials for personal, non-commercial use provided 
                      you do not modify, reproduce, distribute, or create derivative works without our 
                      express written consent.</li>
                  <li>Unauthorized commercial use of any content or products on the Site is prohibited.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Product Information and Use</h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  All products offered through Point Biosciences are for in-vitro laboratory research purposes 
                  only. They are not intended for human or animal consumption, therapeutic use, or any other purpose.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  The products carry inherent risks. Point Biosciences provides purity testing and Certificates 
                  of Analysis (COAs) for all products obtained from third-party suppliers.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  You are solely responsible for compliance with all applicable local, state, federal, and 
                  international laws regarding the handling, use, and disposal of these products.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed">
                  Point Biosciences does not provide medical advice, dosing instructions, or recommendations 
                  for peptide reconstitution or application.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Orders, Payments, and Fulfillment</h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  By placing an order, you authorize the use of the payment method provided. Orders cannot 
                  be modified or canceled after submission.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  All orders are final unless otherwise specified. Point Biosciences is not liable for returns, 
                  exchanges, or refunds for products provided by third-party suppliers.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed">
                  Point Biosciences facilitates communication and delivery but is not responsible for supplier 
                  defects, delays, or errors. Any claims regarding product quality or delivery must be submitted 
                  to the supplier; we will assist as a facilitator.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Disclaimers and Liability</h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  The Site and all content are provided "as is" without warranties of any kind, express or implied.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  Point Biosciences is not liable for any direct, indirect, incidental, consequential, or punitive 
                  damages arising from your use of the Site or products purchased through it.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  By using the Site, you agree to indemnify and hold Point Biosciences harmless from any claims, 
                  losses, liabilities, or expenses arising from your use, handling, or possession of products 
                  purchased through the Site.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed">
                  We make no warranty regarding the accuracy, completeness, or reliability of any content or 
                  product information on the Site.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Intellectual Property</h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  All content, including logos, graphics, text, designs, and Site structure, is the property of 
                  Point Biosciences or its licensors and is protected by copyright, trademark, and other 
                  intellectual property laws.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed">
                  You may not reproduce, distribute, or create derivative works from the Site or content without 
                  our express written consent.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Privacy</h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  Personal information collected on the Site, including name, email, and purchase details, will 
                  be handled in accordance with our Privacy Policy.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  We do not sell or rent your personal information to third parties.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed">
                  Transactions are encrypted, and sensitive information is protected with industry-standard 
                  security measures.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Third-Party Links</h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  The Site may include links to third-party suppliers or websites. Point Biosciences does not 
                  endorse or guarantee these third parties and is not responsible for their content, products, 
                  or practices.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Compliance and Regulatory Responsibility</h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  You are solely responsible for ensuring that all purchases comply with your country's regulations, 
                  including import/export controls, licensing, and permits.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed">
                  Point Biosciences assumes no responsibility for non-compliance by any customer.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Governing Law</h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  These Terms are governed by the laws of Florida, United States, without regard to conflict of 
                  law principles.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed">
                  Any disputes will be resolved in the courts of Florida, and you consent to exclusive jurisdiction 
                  in those courts.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Amendments</h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  Point Biosciences reserves the right to modify these Terms at any time.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed">
                  Changes are effective immediately upon posting. Continued use of the Site constitutes acceptance 
                  of updated Terms.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Force Majeure</h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  Point Biosciences is not liable for delays or failures caused by circumstances beyond our 
                  reasonable control, including supplier delays, shipping disruptions, customs issues, or 
                  technical problems.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Complete Agreement</h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  These Terms, together with the Privacy Policy, constitute the entire agreement between you 
                  and Point Biosciences regarding your use of the Site.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed">
                  Any prior agreements, communications, or understandings are superseded.
                </p>
              </section>

              <div className="border-t border-border/50 pt-8 mt-12">
                <p className="font-body text-muted-foreground leading-relaxed text-center">
                  By using this Site and placing an order, you acknowledge that you have read, understood, 
                  and agree to these Terms and Conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
