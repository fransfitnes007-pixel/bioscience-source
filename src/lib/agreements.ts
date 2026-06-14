// Agreement text bodies + version metadata.
// Bumping a version forces re-signing.

export type AgreementType = "purchaser_terms" | "b2b_terms" | "creator_campaign";

export const AGREEMENT_VERSIONS: Record<AgreementType, string> = {
  purchaser_terms: "v2-2026.06",
  b2b_terms: "v1-2026.06",
  creator_campaign: "v1-2026.06",
};

export const AGREEMENT_TITLES: Record<AgreementType, string> = {
  purchaser_terms: "Individual Purchaser Terms & Conditions",
  b2b_terms: "B2B Purchase Terms & Conditions",
  creator_campaign: "Creator Campaign Participation Agreement",
};

export const PURCHASER_TERMS = `RESURRECTED LABS
PURCHASE TERMS & CONDITIONS

By clicking "I Agree," completing a purchase, submitting payment, creating an account, or accessing products sold through Resurrected Labs ("Company"), Purchaser acknowledges and agrees to be legally bound by these Terms & Conditions.

1. Research Use Only Acknowledgment

Purchaser expressly acknowledges and agrees that:
• All products sold by Company are intended solely for lawful laboratory, research, investigational, and analytical purposes
• Products are NOT intended for human consumption unless expressly stated otherwise under applicable law
• Products are NOT approved by the United States Food and Drug Administration ("FDA") to diagnose, treat, cure, or prevent disease
• Company makes no representations regarding therapeutic or medical benefits

Purchaser further acknowledges:
• Products may involve unknown risks
• Purchaser assumes full responsibility for handling, storage, and use
• Purchaser possesses adequate knowledge regarding research materials and laboratory procedures

2. Purchaser Eligibility

Purchaser represents and warrants that Purchaser:
• Is at least twenty-one (21) years old
• Is legally authorized to purchase products
• Will use products only for lawful purposes
• Will not use products in violation of applicable laws or regulations

3. Prohibited Uses

Purchaser agrees NOT to:
• Use products for unlawful purposes
• Market products as approved drugs
• Resell products in violation of law
• Misrepresent product purpose
• Use products in human clinical applications unless legally authorized
• Use products contrary to FDA regulations

4. No Medical Claims or Advice

Company does not:
• Provide medical advice
• Recommend products for treatment
• Guarantee outcomes
• Represent products as safe or effective for human consumption

Nothing on the website, Platform, advertisements, or communications constitutes medical advice.

Purchaser agrees not to rely upon Company for medical guidance.

5. Business Purchaser Representations

If Purchaser is purchasing on behalf of a business, clinic, laboratory, or entity, Purchaser represents that:
• Purchaser has authority to bind such entity
• Products will be handled in compliance with applicable laws
• Purchaser assumes responsibility for downstream compliance

6. Assumption of Risk

Purchaser knowingly assumes all risks associated with:
• Purchase
• Possession
• Storage
• Handling
• Transportation
• Use of products

Purchaser releases Company from liability arising from misuse or unlawful use.

7. Limitation of Liability

To the fullest extent permitted by law:
• Products are provided "AS IS"
• Company disclaims all warranties
• Company shall not be liable for indirect, incidental, punitive, or consequential damages

Company's maximum liability shall not exceed the amount paid for the applicable order.

8. Indemnification

Purchaser agrees to indemnify and hold harmless Company from claims arising from:
• Product misuse
• Regulatory violations
• Illegal conduct
• Improper storage or handling
• Third-party claims arising from Purchaser conduct

9. Payment Authorization

By submitting payment, Purchaser:
• Authorizes Company to process payment
• Confirms all billing information is accurate
• Acknowledges orders may be refused or canceled at Company discretion

10. No Refunds, Returns, Guarantees, or Chargeback Rights

All purchases are final. Company does not offer refunds, returns, exchanges, credits, or cancellations unless expressly required by applicable law. Company makes no guarantees regarding product performance, research outcomes, or suitability for any intended purpose.

Orders may not be canceled once submitted, processed, fulfilled, or shipped.

Any unauthorized chargebacks, payment disputes, fraudulent refund attempts, or unauthorized transaction reversals may result in:
• Immediate account suspension or termination
• Permanent purchasing restrictions
• Collection activity
• Recovery of legal fees and administrative costs where permitted by law
• Legal action for breach of these Terms & Conditions

11. Arbitration & Governing Law

Any dispute arising from these Terms shall be resolved exclusively through binding arbitration in Arizona.

Purchaser waives:
• Jury trial rights
• Participation in class actions

Arizona and Florida law governs these Terms.

12. Electronic Acceptance

By clicking "I Agree," Purchaser acknowledges that electronic acceptance constitutes a legally binding electronic signature under applicable law, including the E-SIGN Act and UETA.

Purchaser further acknowledges:
• Purchaser has read these Terms
• Purchaser understands these Terms
• Purchaser voluntarily agrees to these Terms before completing payment`;

export const B2B_TERMS = `RESURRECTED LABS
B2B PURCHASE TERMS & CONDITIONS

By clicking "I Agree," completing a purchase, submitting payment, creating an account, or accessing products sold through Resurrected Labs ("Company"), Purchaser acknowledges and agrees to be legally bound by these Terms & Conditions.

RESEARCH USE ONLY ACKNOWLEDGMENT
Purchaser expressly acknowledges and agrees that all products sold by Company are intended solely for lawful laboratory, research, investigational, and analytical purposes; are NOT intended for human consumption unless expressly stated otherwise under applicable law; are NOT approved by the FDA to diagnose, treat, cure, or prevent disease; and Company makes no representations regarding therapeutic or medical benefits.

PURCHASER ELIGIBILITY
Purchaser represents and warrants that Purchaser is at least eighteen (18) years old, is legally authorized to purchase products, will use products only for lawful purposes, and will not use products in violation of applicable laws or regulations.

PROHIBITED USES
Purchaser agrees NOT to use products for unlawful purposes, market products as approved drugs, resell products in violation of law, misrepresent product purpose, use products in human clinical applications unless legally authorized, or use products contrary to FDA regulations.

NO MEDICAL CLAIMS OR ADVICE
Company does not provide medical advice, recommend products for treatment, guarantee outcomes, or represent products as safe or effective for human consumption. Nothing on the website or in communications constitutes medical advice. Purchaser agrees not to rely upon Company for medical guidance.

BUSINESS PURCHASER REPRESENTATIONS
If Purchaser is purchasing on behalf of a business, clinic, laboratory, or entity, Purchaser represents that Purchaser has authority to bind such entity, products will be handled in compliance with applicable laws, and Purchaser assumes responsibility for downstream compliance.

ASSUMPTION OF RISK
Purchaser knowingly assumes all risks associated with purchase, possession, storage, handling, transportation, and use of products. Purchaser releases Company from liability arising from misuse or unlawful use.

LIMITATION OF LIABILITY
To the fullest extent permitted by law, products are provided "AS IS." Company disclaims all warranties. Company shall not be liable for indirect, incidental, punitive, or consequential damages. Company's maximum liability shall not exceed the amount paid for the applicable order.

INDEMNIFICATION
Purchaser agrees to indemnify and hold harmless Company from claims arising from product misuse, regulatory violations, illegal conduct, improper storage or handling, and third-party claims arising from Purchaser conduct.

PAYMENT AUTHORIZATION
By submitting payment, Purchaser authorizes Company to process payment, confirms all billing information is accurate, and acknowledges orders may be refused or canceled at Company discretion.

NO REFUNDS, RETURNS, GUARANTEES, OR CHARGEBACK RIGHTS
All B2B, wholesale, laboratory, clinic, and commercial purchases are final. Company does not offer refunds, returns, exchanges, credits, or cancellations unless expressly required by applicable law. Company makes no guarantees regarding product performance, research outcomes, commercial viability, or suitability. Business Purchaser assumes full responsibility for all purchasing decisions. Orders may not be canceled once submitted, processed, fulfilled, or shipped. Unauthorized chargebacks, payment disputes, or fraudulent refund attempts may result in immediate account suspension or termination, permanent purchasing restrictions, collection activity, recovery of legal fees, and legal action.

ARBITRATION & GOVERNING LAW
Any dispute arising from these Terms shall be resolved exclusively through binding arbitration in Arizona. Purchaser waives jury trial rights and participation in class actions. Arizona and Florida law governs these Terms.

ELECTRONIC ACCEPTANCE
By clicking "I Agree" and entering your initials below, Purchaser acknowledges that electronic acceptance constitutes a legally binding electronic signature under applicable law, including the E-SIGN Act and UETA. Purchaser has read, understands, and voluntarily agrees to these Terms before completing payment.`;

export const CREATOR_AGREEMENT = `RESURRECTED LABZ
CAMPAIGN PARTICIPATION AGREEMENT
Independent Contractor Agreement for Creator Engagement

This Creator Affiliate, UGC Licensing & Retainer Agreement ("Agreement") is entered into by and between Resurrected Labz ("Company") and the undersigned creator ("Creator") as of the Effective Date listed within this Agreement.

This Agreement governs Creator participation in Company affiliate campaigns, creator partnerships, content creation initiatives, UGC licensing arrangements, revenue-sharing programs, and monthly retainer opportunities.

This Agreement establishes a legally binding independent contractor relationship governing affiliate sales, promotional obligations, creator compensation, UGC licensing, intellectual property rights, confidentiality, FTC/FDA compliance, brand safety, platform compliance, fraud prevention, revenue milestone incentives, retainer eligibility, and creator conduct standards.

1. PARTIES
Company: Resurrected Labz
Creator: [the undersigned]
Effective Date: date of signing below
Program Term: This Agreement begins on the Effective Date and continues until terminated pursuant to Section 23.

2. PURPOSE OF AGREEMENT
Company engages Creator as an independent contractor to promote Company products, generate affiliate sales, create original UGC content, publish promotional content, participate in affiliate campaigns and creator retention programs, and license creator content for advertising purposes through Creator-owned social media, websites, communities, email lists, and digital platforms. Creator agrees to create and publish promotional content in exchange for commissions, discounts, milestone incentives, and possible retainer compensation.

3. CREATOR STATUS
Creator is an independent contractor and not an employee, partner, representative, franchisee, or agent of Company. Nothing in this Agreement creates employment, partnership, joint venture, agency, or fiduciary relationship. Creator is solely responsible for taxes, insurance, business licensing, expenses, legal compliance, accounting obligations, and federal and state filings. Company shall not provide payroll taxes, employee benefits, healthcare, retirement benefits, or workers compensation.

4. ELIGIBILITY REQUIREMENTS
Creator represents and warrants that Creator is at least eighteen (18) years of age, has full legal authority to enter this Agreement, owns or controls all content submitted, and has not previously been banned for fraud-related affiliate activity. Company reserves the right to deny participation at its sole discretion.

5. CREATOR DASHBOARD & TRACKING
Company may provide Creator access to affiliate dashboard, creator portal, revenue tracking, commission tracking, conversion analytics, discount code performance, retainer milestone progress, and payout reporting. Company systems and analytics serve as the official source of truth. Tracking discrepancies may occur due to attribution windows, cookies, ad blockers, refunds, or platform limitations. Company reserves the right to adjust commissions for invalid transactions, correct reporting errors, audit affiliate activity, and suspend tracking access during investigations.

6. AFFILIATE COMMISSION STRUCTURE
6.1 Standard Affiliate Commission — Creator shall receive 20% commission on verified Net Sales directly attributable to Creator's affiliate code or tracking link. "Net Sales" excludes refunds, chargebacks, failed payments, fraudulent orders, taxes, shipping fees, coupon abuse, and unauthorized discounts.
6.2 Customer Discount Code — Customers using Creator's code shall receive 10% off eligible purchases. Company reserves the right to modify discount percentages, run temporary promotions, disable codes, or reassign tracking links upon written notice.
6.3 Creator Product Discount — Creator shall receive 30% off Company products solely for personal research usage, product testing, content creation, educational, and demonstration purposes. Creator may NOT resell discounted products, distribute inventory commercially, abuse creator discounts, or purchase inventory for unauthorized resale. Violation constitutes material breach.

7. RETAINER & REVENUE MILESTONE PROGRAM
7.1 Retainer Qualification — Creator becomes eligible for monthly retainer compensation once Creator generates $30,000 USD in verified Net Sales within any rolling thirty (30) day period.
7.2 Retainer Compensation Structure:
$30,000 → $3,000/mo
$40,000 → $4,000/mo
$50,000 → $5,000/mo
$60,000 → $6,000/mo
For every additional $10,000 generated above the initial $30,000 threshold during any rolling 30-day period, Creator earns an additional $1,000 monthly retainer increase.
7.3 Revenue Verification — Determined solely using Company payment processor records, affiliate software analytics, internal sales reporting, and verified transaction history. Only completed and non-refunded purchases qualify. Company records shall serve as the controlling source of truth.
7.4 Mid-Month Qualification — Retainer activates upon verification; Company may prorate payment for the remainder of the month.
7.5 Retainer Maintenance — To maintain eligibility, Creator must continue active content posting, maintain good standing, avoid fraudulent practices, comply with all platform policies, and maintain minimum posting requirements. Failure to maintain reasonable promotional activity may result in suspension, reduction, or removal from retainer program.
7.6 No Guaranteed Income — Company makes no guarantee regarding Creator earnings, sales performance, audience conversion, retainer qualification, revenue consistency, or campaign profitability. All compensation is performance-dependent.

8. CONTENT REQUIREMENTS & POSTING OBLIGATIONS
Creator agrees to publish consistent promotional content, maintain active posting frequency, create original content, follow campaign instructions, and accurately represent Company products. Minimum posting requirements: minimum of three (3) promotional posts/videos per week unless otherwise agreed in writing. Approved platforms include TikTok, Instagram, YouTube, X/Twitter, Facebook, and email newsletters.

9. CONTENT RETENTION REQUIREMENT
Creator agrees to keep all approved promotional content publicly accessible for a minimum of ninety (90) consecutive days from the original posting date unless removal is legally required, platform rules require removal, or Company provides written approval. Unauthorized early removal may result in forfeited commissions, impacted retainer eligibility, and proportional payment reductions.

10. FTC, FDA & PLATFORM COMPLIANCE
Creator agrees to comply with FTC endorsement guidelines, FDA advertising restrictions, TikTok/Meta/YouTube advertising policies, and federal and state consumer protection laws. Creator must clearly disclose affiliate relationships using disclosures including #ad, #sponsored, "paid partnership," and "affiliate link." Creator may NOT make false medical claims, claim products diagnose/treat/cure/prevent disease, guarantee health outcomes, misrepresent scientific research, use deceptive marketing tactics, or make unapproved peptide-related claims.

11. FDA DISCLAIMER & PRODUCT REPRESENTATION
Company products are not for human consumption and are not intended to diagnose, treat, cure, or prevent any disease. Company products are sold for research purposes only. Creator shall not represent otherwise, make medical guarantees, suggest FDA approval where none exists, state or imply products are pharmaceutical drugs, or present anecdotal experiences as medical fact.

12. AGE RESTRICTIONS & MINOR TARGETING
Creator represents and warrants that Creator is at least eighteen (18) years of age and agrees not to market products toward minors, intentionally target audiences under eighteen (18), use messaging primarily directed toward minors, or portray products as intended for underage individuals.

13. INVALID TRAFFIC, FRAUD & PROHIBITED CONDUCT
Creator may NOT engage in bot traffic, fake purchases, self-referrals, incentivized purchases, coupon abuse, spam marketing, fake engagement, artificial metric inflation, unauthorized paid traffic campaigns, or misleading representations. Company reserves the right to reverse commissions, withhold payments, ban Creator, and pursue legal remedies for fraudulent activity.

14. UGC LICENSE GRANT
Creator grants Company a worldwide, perpetual, royalty-free, sublicensable license to use, modify, distribute, publish, and create derivative works from any content Creator submits, posts, or tags Company in for promotional purposes — including paid advertising, organic social, email, website, and partner channels.

15. CONFIDENTIALITY
Creator shall maintain in strict confidence all non-public Company information, including commission rates, retainer terms, internal analytics, product roadmaps, and business strategies.

16. INTELLECTUAL PROPERTY
Company retains all rights to Company trademarks, branding, product imagery, and marketing materials. Creator may use Company assets solely for the purpose of fulfilling this Agreement.

17. PAYMENT TERMS
Commissions are paid on a Net-30 basis following the close of each monthly period, subject to a minimum payout threshold and verification of Net Sales.

18. TERMINATION
Either party may terminate this Agreement at any time with written notice. Company may terminate immediately for breach, fraud, regulatory violation, or conduct harmful to Company.

19. SURVIVAL
Sections covering IP, UGC license, confidentiality, indemnification, limitation of liability, and governing law survive termination.

20. INDEMNIFICATION
Creator agrees to indemnify and hold harmless Company from claims arising from Creator's content, statements, conduct, or breach of this Agreement.

21. LIMITATION OF LIABILITY
To the fullest extent permitted by law, Company's total liability under this Agreement shall not exceed the total commissions paid to Creator in the prior twelve (12) months.

22. GOVERNING LAW & ARBITRATION
Any dispute arising under this Agreement shall be resolved through binding arbitration in Arizona. Arizona and Florida law govern this Agreement. Creator waives jury trial rights and participation in class actions.

23. ENTIRE AGREEMENT
This Agreement constitutes the entire understanding between the parties and supersedes all prior agreements, representations, and understandings.

ELECTRONIC ACCEPTANCE
By clicking "I Agree" and entering Creator's initials below, Creator acknowledges that electronic acceptance constitutes a legally binding electronic signature under the E-SIGN Act and UETA. Creator has read, understands, and voluntarily agrees to this Agreement.`;

export const AGREEMENT_BODIES: Record<AgreementType, string> = {
  purchaser_terms: PURCHASER_TERMS,
  b2b_terms: B2B_TERMS,
  creator_campaign: CREATOR_AGREEMENT,
};

// Derive expected initials from a name: first letter of first name + first letter of last name.
export function expectedInitials(fullName: string | null | undefined): string {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return "";
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}
