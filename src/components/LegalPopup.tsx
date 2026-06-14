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
              {isTerms ? "Purchase Terms & Conditions" : "Privacy Policy"}
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
                By clicking "I Agree," completing a purchase, submitting payment, creating an account, or accessing products sold through Resurrected Labs ("Company"), Purchaser acknowledges and agrees to be legally bound by these Terms &amp; Conditions.
              </p>

              <section className="mb-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">1. Research Use Only Acknowledgment</h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-2">
                  Purchaser expressly acknowledges and agrees that:
                </p>
                <ul className="font-body text-muted-foreground leading-relaxed list-disc list-inside space-y-1 mb-2">
                  <li>All products sold by Company are intended solely for lawful laboratory, research, investigational, and analytical purposes</li>
                  <li>Products are NOT intended for human consumption unless expressly stated otherwise under applicable law</li>
                  <li>Products are NOT approved by the United States Food and Drug Administration ("FDA") to diagnose, treat, cure, or prevent disease</li>
                  <li>Company makes no representations regarding therapeutic or medical benefits</li>
                </ul>
                <p className="font-body text-muted-foreground leading-relaxed mb-2">
                  Purchaser further acknowledges:
                </p>
                <ul className="font-body text-muted-foreground leading-relaxed list-disc list-inside space-y-1">
                  <li>Products may involve unknown risks</li>
                  <li>Purchaser assumes full responsibility for handling, storage, and use</li>
                  <li>Purchaser possesses adequate knowledge regarding research materials and laboratory procedures</li>
                </ul>
              </section>

              <section className="mb-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">2. Purchaser Eligibility</h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-2">
                  Purchaser represents and warrants that Purchaser:
                </p>
                <ul className="font-body text-muted-foreground leading-relaxed list-disc list-inside space-y-1">
                  <li>Is at least twenty-one (21) years old</li>
                  <li>Is legally authorized to purchase products</li>
                  <li>Will use products only for lawful purposes</li>
                  <li>Will not use products in violation of applicable laws or regulations</li>
                </ul>
              </section>

              <section className="mb-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">3. Prohibited Uses</h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-2">
                  Purchaser agrees NOT to:
                </p>
                <ul className="font-body text-muted-foreground leading-relaxed list-disc list-inside space-y-1">
                  <li>Use products for unlawful purposes</li>
                  <li>Market products as approved drugs</li>
                  <li>Resell products in violation of law</li>
                  <li>Misrepresent product purpose</li>
                  <li>Use products in human clinical applications unless legally authorized</li>
                  <li>Use products contrary to FDA regulations</li>
                </ul>
              </section>

              <section className="mb-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">4. No Medical Claims or Advice</h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-2">
                  Company does not:
                </p>
                <ul className="font-body text-muted-foreground leading-relaxed list-disc list-inside space-y-1 mb-2">
                  <li>Provide medical advice</li>
                  <li>Recommend products for treatment</li>
                  <li>Guarantee outcomes</li>
                  <li>Represent products as safe or effective for human consumption</li>
                </ul>
                <p className="font-body text-muted-foreground leading-relaxed mb-2">
                  Nothing on the website, Platform, advertisements, or communications constitutes medical advice.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed">
                  Purchaser agrees not to rely upon Company for medical guidance.
                </p>
              </section>

              <section className="mb-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">5. Business Purchaser Representations</h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-2">
                  If Purchaser is purchasing on behalf of a business, clinic, laboratory, or entity, Purchaser represents that:
                </p>
                <ul className="font-body text-muted-foreground leading-relaxed list-disc list-inside space-y-1">
                  <li>Purchaser has authority to bind such entity</li>
                  <li>Products will be handled in compliance with applicable laws</li>
                  <li>Purchaser assumes responsibility for downstream compliance</li>
                </ul>
              </section>

              <section className="mb-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">6. Assumption of Risk</h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-2">
                  Purchaser knowingly assumes all risks associated with:
                </p>
                <ul className="font-body text-muted-foreground leading-relaxed list-disc list-inside space-y-1 mb-2">
                  <li>Purchase</li>
                  <li>Possession</li>
                  <li>Storage</li>
                  <li>Handling</li>
                  <li>Transportation</li>
                  <li>Use of products</li>
                </ul>
                <p className="font-body text-muted-foreground leading-relaxed">
                  Purchaser releases Company from liability arising from misuse or unlawful use.
                </p>
              </section>

              <section className="mb-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">7. Limitation of Liability</h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-2">
                  To the fullest extent permitted by law:
                </p>
                <ul className="font-body text-muted-foreground leading-relaxed list-disc list-inside space-y-1 mb-2">
                  <li>Products are provided "AS IS"</li>
                  <li>Company disclaims all warranties</li>
                  <li>Company shall not be liable for indirect, incidental, punitive, or consequential damages</li>
                </ul>
                <p className="font-body text-muted-foreground leading-relaxed">
                  Company's maximum liability shall not exceed the amount paid for the applicable order.
                </p>
              </section>

              <section className="mb-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">8. Indemnification</h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-2">
                  Purchaser agrees to indemnify and hold harmless Company from claims arising from:
                </p>
                <ul className="font-body text-muted-foreground leading-relaxed list-disc list-inside space-y-1">
                  <li>Product misuse</li>
                  <li>Regulatory violations</li>
                  <li>Illegal conduct</li>
                  <li>Improper storage or handling</li>
                  <li>Third-party claims arising from Purchaser conduct</li>
                </ul>
              </section>

              <section className="mb-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">9. Payment Authorization</h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-2">
                  By submitting payment, Purchaser:
                </p>
                <ul className="font-body text-muted-foreground leading-relaxed list-disc list-inside space-y-1">
                  <li>Authorizes Company to process payment</li>
                  <li>Confirms all billing information is accurate</li>
                  <li>Acknowledges orders may be refused or canceled at Company discretion</li>
                </ul>
              </section>

              <section className="mb-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">10. No Refunds, Returns, Guarantees, or Chargeback Rights</h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  All purchases are final. Company does not offer refunds, returns, exchanges, credits, or cancellations unless expressly required by applicable law. Company makes no guarantees regarding product performance, research outcomes, or suitability for any intended purpose.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed mb-2">
                  Orders may not be canceled once submitted, processed, fulfilled, or shipped.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed mb-2">
                  Any unauthorized chargebacks, payment disputes, fraudulent refund attempts, or unauthorized transaction reversals may result in:
                </p>
                <ul className="font-body text-muted-foreground leading-relaxed list-disc list-inside space-y-1">
                  <li>Immediate account suspension or termination</li>
                  <li>Permanent purchasing restrictions</li>
                  <li>Collection activity</li>
                  <li>Recovery of legal fees and administrative costs where permitted by law</li>
                  <li>Legal action for breach of these Terms &amp; Conditions</li>
                </ul>
              </section>

              <section className="mb-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">11. Arbitration &amp; Governing Law</h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-2">
                  Any dispute arising from these Terms shall be resolved exclusively through binding arbitration in Arizona.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed mb-2">
                  Purchaser waives:
                </p>
                <ul className="font-body text-muted-foreground leading-relaxed list-disc list-inside space-y-1 mb-2">
                  <li>Jury trial rights</li>
                  <li>Participation in class actions</li>
                </ul>
                <p className="font-body text-muted-foreground leading-relaxed">
                  Arizona and Florida law governs these Terms.
                </p>
              </section>

              <section className="mb-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">12. Electronic Acceptance</h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-2">
                  By clicking "I Agree," Purchaser acknowledges that electronic acceptance constitutes a legally binding electronic signature under applicable law, including the E-SIGN Act and UETA.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed mb-2">
                  Purchaser further acknowledges:
                </p>
                <ul className="font-body text-muted-foreground leading-relaxed list-disc list-inside space-y-1">
                  <li>Purchaser has read these Terms</li>
                  <li>Purchaser understands these Terms</li>
                  <li>Purchaser voluntarily agrees to these Terms before completing payment</li>
                </ul>
              </section>

              <p className="font-body text-muted-foreground leading-relaxed text-center pt-4 border-t border-border/50">
                By using this Site and placing an order, you acknowledge that you have read, understood, and agree to these Terms &amp; Conditions.
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
                  Our Site is not intended for individuals under 21. We do not knowingly collect personal information from anyone under 21.
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
