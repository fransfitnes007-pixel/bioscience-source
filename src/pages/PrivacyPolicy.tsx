import { Layout } from "@/components/layout/Layout";

const PrivacyPolicy = () => {
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
                Privacy Policy
              </h2>
              <p className="font-body text-muted-foreground mt-4">
                Effective Date: January 1, 2025
              </p>
            </div>

            {/* Privacy Policy Content */}
            <div className="prose prose-invert max-w-none animate-fade-up animation-delay-100">
              <p className="font-body text-muted-foreground leading-relaxed mb-8">
                Point Biosciences ("we," "us," or "our") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your 
                information when you visit our website www.pointbiosciences.com ("Site") or make 
                a purchase through our platform.
              </p>

              <section className="mb-8">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Information We Collect</h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  We may collect personal information that you voluntarily provide when using our Site, including:
                </p>
                <ul className="font-body text-muted-foreground leading-relaxed list-disc list-inside space-y-2">
                  <li>Name and contact information (email address, phone number, mailing address)</li>
                  <li>Business information (company name, business type, professional credentials)</li>
                  <li>Payment and billing information</li>
                  <li>Order history and product preferences</li>
                  <li>Communications you send to us</li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Automatically Collected Information</h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  When you access our Site, we may automatically collect certain information, including:
                </p>
                <ul className="font-body text-muted-foreground leading-relaxed list-disc list-inside space-y-2">
                  <li>Device and browser information</li>
                  <li>IP address and location data</li>
                  <li>Pages visited and time spent on the Site</li>
                  <li>Referring website or source</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">How We Use Your Information</h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  We use the information we collect for the following purposes:
                </p>
                <ul className="font-body text-muted-foreground leading-relaxed list-disc list-inside space-y-2">
                  <li>To process and fulfill your orders</li>
                  <li>To communicate with you about your account, orders, and inquiries</li>
                  <li>To verify your eligibility to purchase products</li>
                  <li>To improve our Site, products, and services</li>
                  <li>To send promotional communications (with your consent)</li>
                  <li>To comply with legal obligations</li>
                  <li>To prevent fraud and ensure security</li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Information Sharing and Disclosure</h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share 
                  your information in the following circumstances:
                </p>
                <ul className="font-body text-muted-foreground leading-relaxed list-disc list-inside space-y-2">
                  <li><strong>Third-Party Suppliers:</strong> To facilitate order fulfillment with our vetted suppliers</li>
                  <li><strong>Service Providers:</strong> With companies that help us operate our business (payment processors, shipping carriers, analytics providers)</li>
                  <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>Protection of Rights:</strong> To protect our rights, privacy, safety, or property</li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Cookies and Tracking Technologies</h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  We use cookies and similar technologies to enhance your experience on our Site. These technologies help us:
                </p>
                <ul className="font-body text-muted-foreground leading-relaxed list-disc list-inside space-y-2">
                  <li>Remember your preferences and settings</li>
                  <li>Understand how you use our Site</li>
                  <li>Analyze traffic and improve functionality</li>
                  <li>Provide personalized content</li>
                </ul>
                <p className="font-body text-muted-foreground leading-relaxed mt-4">
                  You can control cookies through your browser settings. However, disabling cookies may 
                  affect your ability to use certain features of our Site.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Data Security</h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  We implement industry-standard security measures to protect your personal information, including:
                </p>
                <ul className="font-body text-muted-foreground leading-relaxed list-disc list-inside space-y-2">
                  <li>SSL/TLS encryption for data transmission</li>
                  <li>Secure payment processing through trusted providers</li>
                  <li>Regular security assessments and updates</li>
                  <li>Limited access to personal information by authorized personnel only</li>
                </ul>
                <p className="font-body text-muted-foreground leading-relaxed mt-4">
                  While we strive to protect your information, no method of transmission over the Internet 
                  is 100% secure. We cannot guarantee absolute security.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Data Retention</h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  We retain your personal information for as long as necessary to fulfill the purposes 
                  outlined in this Privacy Policy, comply with legal obligations, resolve disputes, and 
                  enforce our agreements. When no longer needed, we will securely delete or anonymize 
                  your information.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Your Rights and Choices</h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  Depending on your location, you may have the following rights regarding your personal information:
                </p>
                <ul className="font-body text-muted-foreground leading-relaxed list-disc list-inside space-y-2">
                  <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                  <li><strong>Data Portability:</strong> Request your data in a portable format</li>
                </ul>
                <p className="font-body text-muted-foreground leading-relaxed mt-4">
                  To exercise these rights, please contact us at info@pointbiosciences.com.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Children's Privacy</h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  Our Site is not intended for individuals under the age of 21. We do not knowingly collect 
                  personal information from anyone under 21 years of age. If we become aware that we have 
                  collected personal information from someone under 21, we will take steps to delete that 
                  information promptly.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Third-Party Links</h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  Our Site may contain links to third-party websites. We are not responsible for the privacy 
                  practices or content of these external sites. We encourage you to review the privacy policies 
                  of any third-party sites you visit.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Changes to This Privacy Policy</h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. Changes will be posted on this page 
                  with an updated effective date. We encourage you to review this Privacy Policy periodically. 
                  Your continued use of the Site after any changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Governing Law</h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  This Privacy Policy is governed by the laws of Florida, United States, without regard to 
                  conflict of law principles.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed">
                  Any disputes arising from this Privacy Policy will be resolved in the courts of Florida, 
                  and you consent to exclusive jurisdiction in those courts.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Contact Us</h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our 
                  data practices, please contact us at:
                </p>
                <div className="font-body text-muted-foreground leading-relaxed">
                  <p><strong>Point Biosciences</strong></p>
                  <p>Email: info@pointbiosciences.com</p>
                  <p>Phone: (602) 399-5298 | (602) 469-7146</p>
                </div>
              </section>

              <div className="border-t border-border/50 pt-8 mt-12">
                <p className="font-body text-muted-foreground leading-relaxed text-center">
                  By using our Site, you acknowledge that you have read and understood this Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
