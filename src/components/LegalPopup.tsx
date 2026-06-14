import { X } from "lucide-react";

interface LegalPopupProps {
  type: "terms" | "privacy";
  onClose: () => void;
}

export const LegalPopup = ({ type, onClose }: LegalPopupProps) => {
  const isTerms = type === "terms";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/90 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground">
              {isTerms ? "Terms & Conditions" : "Privacy Policy"}
            </h2>
            <p className="font-body text-xs text-muted-foreground mt-1">
              Effective Date: January 1, 2025
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 prose prose-invert max-w-none">
          {isTerms ? (
            <>
              <p className="font-body text-muted-foreground leading-relaxed mb-6">
                By accessing or using our website ("Site"), you agree to comply with and be bound by these Terms and Conditions. These Terms govern your use of our Site and any services offered by Resurrected ("we," "us," or "our"). If you do not agree with these Terms, you may not access or use the Site.
              </p>

              <section className="mb-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">General Overview</h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  Resurrected is a retailer of premium research peptides and compounds. We source products from vetted, certified third-party suppliers and deliver them directly to our customers. All products are sold for research purposes only.
                </p>
              </section>

              <section className="mb-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Eligibility</h3>
                <ul className="font-body text-muted-foreground leading-relaxed list-disc list-inside space-y-1">
                  <li>You must be at least 18 years of age.</li>
                  <li>You must agree that all products purchased are for research purposes only and are not intended for human or animal consumption.</li>
                </ul>
              </section>

              <section className="mb-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Product Information and Use</h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  All products offered through Resurrected are for in-vitro laboratory research purposes only. They are not intended for human or animal consumption, therapeutic use, or any other purpose. Resurrected provides purity testing and Certificates of Analysis (COAs) for all products. You are solely responsible for compliance with all applicable laws.
                </p>
              </section>

              <section className="mb-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Orders, Payments, and Fulfillment</h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  By placing an order, you authorize the use of the payment method provided. Orders cannot be modified or canceled after submission. All orders are final unless a product quality issue is verified. Claims must be submitted within 30 days of receipt.
                </p>
              </section>

              <section className="mb-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Disclaimers and Liability</h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  The Site and all content are provided "as is" without warranties of any kind. Resurrected is not liable for any damages arising from your use of the Site or products purchased through it. By using the Site, you agree to indemnify and hold Resurrected harmless from any claims.
                </p>
              </section>

              <section className="mb-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Intellectual Property</h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  All content, including logos, graphics, text, designs, and Site structure, is the property of Resurrected or its licensors and is protected by copyright, trademark, and other intellectual property laws.
                </p>
              </section>

              <section className="mb-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Governing Law</h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  These Terms are governed by the laws of Florida, United States. Any disputes will be resolved in the courts of Florida.
                </p>
              </section>

              <section className="mb-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Amendments</h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  Resurrected reserves the right to modify these Terms at any time. Changes are effective immediately upon posting. Continued use of the Site constitutes acceptance of updated Terms.
                </p>
              </section>

              <p className="font-body text-muted-foreground leading-relaxed text-center pt-4 border-t border-border/50">
                By using this Site and placing an order, you acknowledge that you have read, understood, and agree to these Terms and Conditions.
              </p>
            </>
          ) : (
            <>
              <p className="font-body text-muted-foreground leading-relaxed mb-6">
                Resurrected ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website ("Site") or make a purchase through our platform.
              </p>

              <section className="mb-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Information We Collect</h3>
                <ul className="font-body text-muted-foreground leading-relaxed list-disc list-inside space-y-1">
                  <li>Name and contact information (email, phone, mailing address)</li>
                  <li>Account information (username, password)</li>
                  <li>Payment and billing information</li>
                  <li>Order history and product preferences</li>
                  <li>Communications you send to us</li>
                </ul>
              </section>

              <section className="mb-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Automatically Collected Information</h3>
                <ul className="font-body text-muted-foreground leading-relaxed list-disc list-inside space-y-1">
                  <li>Device and browser information</li>
                  <li>IP address and location data</li>
                  <li>Pages visited and time spent on the Site</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section className="mb-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">How We Use Your Information</h3>
                <ul className="font-body text-muted-foreground leading-relaxed list-disc list-inside space-y-1">
                  <li>To process and fulfill your orders</li>
                  <li>To communicate with you about your account and orders</li>
                  <li>To improve our Site, products, and services</li>
                  <li>To send promotional communications (with your consent)</li>
                  <li>To comply with legal obligations and prevent fraud</li>
                </ul>
              </section>

              <section className="mb-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Information Sharing</h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  We do not sell, trade, or rent your personal information. We may share it with fulfillment partners, service providers (payment processors, shipping carriers), and when required by law.
                </p>
              </section>

              <section className="mb-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Data Security</h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  We implement SSL/TLS encryption, secure payment processing, regular security assessments, and limit access to authorized personnel only. No method of transmission over the Internet is 100% secure.
                </p>
              </section>

              <section className="mb-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Your Rights</h3>
                <ul className="font-body text-muted-foreground leading-relaxed list-disc list-inside space-y-1">
                  <li><strong>Access:</strong> Request a copy of your personal information</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                </ul>
              </section>

              <section className="mb-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Children's Privacy</h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  Our Site is not intended for individuals under 18. We do not knowingly collect personal information from anyone under 18.
                </p>
              </section>

              <section className="mb-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Contact Us</h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  If you have any questions, please contact us at <strong>support@resurrected.com</strong>.
                </p>
              </section>

              <p className="font-body text-muted-foreground leading-relaxed text-center pt-4 border-t border-border/50">
                By using our Site, you acknowledge that you have read and understood this Privacy Policy.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
