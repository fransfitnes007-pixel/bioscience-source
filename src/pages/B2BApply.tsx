import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Building2,
  Package,
  MapPin,
  Target,
  Sparkles,
  Tag,
  FileImage,
  Upload,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type StepId = "business" | "type" | "location" | "products" | "partnership" | "details" | "logo";

const STEPS: { id: StepId; label: string; icon: any }[] = [
  { id: "business", label: "Business Info", icon: Building2 },
  { id: "type", label: "Business Type", icon: Package },
  { id: "location", label: "Location", icon: MapPin },
  { id: "products", label: "Products", icon: Target },
  { id: "partnership", label: "Partnership", icon: Sparkles },
  { id: "details", label: "Details", icon: Sparkles },
  { id: "logo", label: "Logo", icon: Tag },
];

const BUSINESS_TYPES = [
  { value: "Research Laboratory", label: "Research Laboratory", desc: "Academic or private research facility" },
  { value: "Compounding Pharmacy", label: "Compounding Pharmacy", desc: "Licensed pharmaceutical compounding" },
  { value: "Medical Clinic / Practice", label: "Medical Clinic / Practice", desc: "Healthcare provider or medical office" },
  { value: "Wellness Center / Med Spa", label: "Wellness Center / Med Spa", desc: "Aesthetic or wellness services" },
  { value: "Distributor / Wholesaler", label: "Distributor / Wholesaler", desc: "Resale and distribution" },
  { value: "Manufacturer", label: "Manufacturer", desc: "Product manufacturing" },
  { value: "Other", label: "Other", desc: "Please describe in additional notes" },
];

const VOLUMES = [
  "Under $1,000",
  "$1,000 - $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000 - $50,000",
  "Over $50,000",
];

const REFERRAL_SOURCES = [
  "Google Search",
  "Social Media",
  "Referral / Word of Mouth",
  "Trade Show / Conference",
  "Industry Publication",
  "Other",
];

const inputBase =
  "w-full px-4 py-3 bg-card border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/40 transition-colors";
const labelBase = "font-body text-sm font-medium text-foreground block mb-2";

const B2BApply = () => {
  const navigate = useNavigate();
  const [stepIdx, setStepIdx] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    businessType: "",
    businessAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    productsInterest: "",
    productUsage: "",
    howWeBenefit: "",
    companyImpact: "",
    monthlyVolume: "",
    referralSource: "",
    notes: "",
  });

  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const currentStep = STEPS[stepIdx].id;

  const canContinue = (): boolean => {
    switch (currentStep) {
      case "business":
        return !!(form.businessName && form.contactName && form.email && form.phone);
      case "type":
        return !!form.businessType;
      case "location":
        return !!(form.businessAddress && form.city && form.country);
      case "products":
        return !!(form.productsInterest && form.productUsage);
      case "partnership":
        return !!(form.howWeBenefit && form.companyImpact);
      case "details":
      case "logo":
        return true;
    }
  };

  const next = () => {
    if (!canContinue()) {
      toast.error("Please complete the required fields.");
      return;
    }
    setStepIdx((i) => Math.min(STEPS.length - 1, i + 1));
  };
  const back = () => setStepIdx((i) => Math.max(0, i - 1));

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!["image/png", "application/pdf"].includes(f.type)) {
      toast.error("PNG or PDF only");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error("Max 5MB");
      return;
    }
    setLogoFile(f);
    if (f.type === "image/png") setLogoPreview(URL.createObjectURL(f));
    else setLogoPreview(null);
  };

  const submit = async () => {
    setLoading(true);
    try {
      let companyLogoUrl: string | null = null;
      if (logoFile) {
        const ext = logoFile.name.split(".").pop()?.toLowerCase() || "png";
        const path = `applications/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("company-logos")
          .upload(path, logoFile, { upsert: true, cacheControl: "3600" });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from("company-logos").getPublicUrl(path);
        companyLogoUrl = data.publicUrl;
      }

      const { error } = await supabase.from("applications").insert({
        business_name: form.businessName,
        contact_name: form.contactName,
        email: form.email,
        phone: form.phone || null,
        website: form.website || null,
        business_type: form.businessType,
        business_address: form.businessAddress || null,
        city: form.city || null,
        state: form.state || null,
        zip_code: form.zipCode || null,
        country: form.country,
        products_interest: form.productsInterest || null,
        product_usage: form.productUsage || null,
        how_we_benefit: form.howWeBenefit || null,
        company_impact: form.companyImpact || null,
        monthly_volume: form.monthlyVolume || null,
        referral_source: form.referralSource || "B2B Application",
        notes: form.notes || null,
        company_logo_url: companyLogoUrl,
      });
      if (error) throw error;
      setSubmitted(true);
      toast.success("Application received. We'll be in touch within 48 hours.");
    } catch (err: any) {
      toast.error(err.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center px-6 py-32">
          <div className="max-w-md text-center">
            <div className="w-16 h-16 rounded-full bg-foreground/10 flex items-center justify-center mx-auto mb-8">
              <Check className="w-8 h-8 text-foreground" />
            </div>
            <h1 className="font-body font-bold text-4xl text-foreground tracking-[-0.03em] mb-4">
              Application received.
            </h1>
            <p className="font-body text-muted-foreground/80 mb-10 leading-relaxed">
              Our partnerships team will review your application within 48 hours and reach out with next steps.
            </p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-body text-sm font-medium hover:bg-foreground/90 transition-all"
            >
              Back to home <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-16 md:py-24 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/b2b"
            className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          {/* Stepper */}
          <div className="flex items-center justify-between gap-2 mb-16 overflow-x-auto pb-2">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const active = i === stepIdx;
              const done = i < stepIdx;
              return (
                <div key={s.id} className="flex items-center gap-2 shrink-0">
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all whitespace-nowrap ${
                      active
                        ? "bg-foreground text-background border-foreground"
                        : done
                        ? "bg-card text-foreground border-border"
                        : "bg-card/40 text-muted-foreground border-border/50"
                    }`}
                  >
                    {done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    <span className="font-body text-xs md:text-sm font-medium">{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className="w-6 h-px bg-border" />}
                </div>
              );
            })}
          </div>

          {/* Step content */}
          <div className="max-w-2xl mx-auto">
            {currentStep === "business" && (
              <div className="space-y-6">
                <Header title="Tell us about your business" sub="Let's start with the basics about you and your company." />
                <Field label="Business Name *">
                  <input value={form.businessName} onChange={(e) => update("businessName", e.target.value)} placeholder="Your company name" className={inputBase} />
                </Field>
                <Field label="Your Name *">
                  <input value={form.contactName} onChange={(e) => update("contactName", e.target.value)} placeholder="Full name" className={inputBase} />
                </Field>
                <Field label="Email Address *">
                  <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@company.com" className={inputBase} />
                </Field>
                <Field label="Phone Number *">
                  <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+1 (555) 000-0000" className={inputBase} />
                </Field>
                <Field label="Website (Optional)">
                  <input value={form.website} onChange={(e) => update("website", e.target.value)} placeholder="https://yourcompany.com" className={inputBase} />
                </Field>
              </div>
            )}

            {currentStep === "type" && (
              <div className="space-y-4">
                <Header title="What type of business are you?" sub="This helps us understand how we can best serve you." />
                <div className="space-y-3">
                  {BUSINESS_TYPES.map((t) => {
                    const selected = form.businessType === t.value;
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => update("businessType", t.value)}
                        className={`w-full text-left p-5 rounded-xl border transition-all ${
                          selected ? "border-foreground bg-card" : "border-border bg-card/40 hover:border-foreground/40"
                        }`}
                      >
                        <div className="font-body font-semibold text-foreground">{t.label}</div>
                        <div className="font-body text-sm text-muted-foreground mt-1">{t.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {currentStep === "location" && (
              <div className="space-y-6">
                <Header title="Where is your business located?" sub="We need your business address for verification and shipping." />
                <Field label="Street Address *">
                  <input value={form.businessAddress} onChange={(e) => update("businessAddress", e.target.value)} placeholder="123 Business Street, Suite 100" className={inputBase} />
                </Field>
                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="City *">
                    <input value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="City" className={inputBase} />
                  </Field>
                  <Field label="State / Province">
                    <input value={form.state} onChange={(e) => update("state", e.target.value)} placeholder="State" className={inputBase} />
                  </Field>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="ZIP / Postal Code">
                    <input value={form.zipCode} onChange={(e) => update("zipCode", e.target.value)} placeholder="12345" className={inputBase} />
                  </Field>
                  <Field label="Country *">
                    <input value={form.country} onChange={(e) => update("country", e.target.value)} className={inputBase} />
                  </Field>
                </div>
              </div>
            )}

            {currentStep === "products" && (
              <div className="space-y-6">
                <Header title="What products are you interested in?" sub="Help us understand your product needs and intended use." />
                <Field label="What products are you looking for? *">
                  <textarea rows={5} value={form.productsInterest} onChange={(e) => update("productsInterest", e.target.value)} placeholder="Tell us about the specific peptides, compounds, or product categories you're interested in..." className={inputBase} />
                </Field>
                <Field label="How will you use these products? *">
                  <textarea rows={5} value={form.productUsage} onChange={(e) => update("productUsage", e.target.value)} placeholder="Describe the intended application of these products in your business operations..." className={inputBase} />
                </Field>
              </div>
            )}

            {currentStep === "partnership" && (
              <div className="space-y-6">
                <Header title="Let's build a partnership" sub="Help us understand how we can create value together." />
                <Field label="How can Resurrected Labz benefit your business? *">
                  <textarea rows={5} value={form.howWeBenefit} onChange={(e) => update("howWeBenefit", e.target.value)} placeholder="What are you looking for in a supplier? Quality, pricing, reliability, specific certifications, etc..." className={inputBase} />
                </Field>
                <Field label="What impact can we make on your company? *">
                  <textarea rows={5} value={form.companyImpact} onChange={(e) => update("companyImpact", e.target.value)} placeholder="Tell us about your goals and how a partnership with us could help you achieve them..." className={inputBase} />
                </Field>
              </div>
            )}

            {currentStep === "details" && (
              <div className="space-y-6">
                <Header title="Additional Details" sub="A few more optional details to help us serve you better." />
                <Field label="Estimated Monthly Order Volume">
                  <select value={form.monthlyVolume} onChange={(e) => update("monthlyVolume", e.target.value)} className={inputBase}>
                    <option value="">Select estimated volume...</option>
                    {VOLUMES.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </Field>
                <Field label="How did you hear about us?">
                  <select value={form.referralSource} onChange={(e) => update("referralSource", e.target.value)} className={inputBase}>
                    <option value="">Select...</option>
                    {REFERRAL_SOURCES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </Field>
                <Field label="Additional Notes or Questions">
                  <textarea rows={4} value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Anything else you'd like us to know..." className={inputBase} />
                </Field>
              </div>
            )}

            {currentStep === "logo" && (
              <div className="space-y-6">
                <Header title="Upload Your Company Logo" sub="Want your brand on our vials? Upload your logo for custom labeling." />

                <label className="block cursor-pointer">
                  <input type="file" accept=".png,.pdf,image/png,application/pdf" onChange={handleLogo} className="hidden" />
                  <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-foreground/40 transition-all bg-card/30">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="w-24 h-24 object-contain mx-auto mb-4" />
                    ) : (
                      <div className="w-14 h-14 mx-auto rounded-full bg-secondary/60 flex items-center justify-center mb-4">
                        <FileImage className="w-7 h-7 text-muted-foreground" />
                      </div>
                    )}
                    <p className="font-body font-semibold text-foreground">
                      {logoFile ? logoFile.name : "Upload your company logo"}
                    </p>
                    <p className="font-body text-sm text-muted-foreground mt-1">
                      {logoFile ? "Click to replace" : "Drag and drop or click to browse"}
                    </p>
                  </div>
                </label>

                <div className="p-5 bg-card/40 border border-border rounded-xl">
                  <p className="font-body font-semibold text-foreground mb-3">Requirements:</p>
                  <ul className="font-body text-sm text-muted-foreground space-y-1">
                    <li>• PNG or PDF format</li>
                    <li>• Transparent background required</li>
                    <li>• Maximum file size: 5MB</li>
                    <li>• Recommended: 300×100px minimum</li>
                  </ul>
                </div>

                <div className="p-5 bg-card/40 border border-border rounded-xl">
                  <p className="font-body font-semibold text-foreground mb-3">Why upload your logo?</p>
                  <ul className="font-body text-sm text-muted-foreground space-y-1">
                    <li>• Your company logo will appear on vial labels</li>
                    <li>• Reinforce your brand with every product</li>
                    <li>• Professional appearance for your clients</li>
                  </ul>
                </div>

                <p className="font-body text-center text-sm text-muted-foreground">
                  This step is optional. You can skip it and add your logo later from your dashboard.
                </p>

                <div className="p-5 bg-card/40 border border-border rounded-xl">
                  <h3 className="font-body font-bold text-lg text-foreground mb-4">Application Summary</h3>
                  <dl className="space-y-2 font-body text-sm">
                    <Row k="Business:" v={form.businessName} />
                    <Row k="Contact:" v={form.contactName} />
                    <Row k="Email:" v={form.email} />
                    <Row k="Type:" v={form.businessType} />
                    <Row k="Location:" v={[form.city, form.state].filter(Boolean).join(", ")} />
                    <Row k="Company Logo:" v={logoFile ? logoFile.name : "Not uploaded"} />
                  </dl>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
              <button
                onClick={back}
                disabled={stepIdx === 0}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-body text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              {stepIdx < STEPS.length - 1 ? (
                <button
                  onClick={next}
                  className="inline-flex items-center gap-2 px-7 py-3 bg-foreground text-background rounded-full font-body text-sm font-medium hover:bg-foreground/90 transition-all"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={submit}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-7 py-3 bg-foreground text-background rounded-full font-body text-sm font-medium hover:bg-foreground/90 transition-all disabled:opacity-50"
                >
                  {loading ? "Submitting…" : "Submit Application"}
                  {!loading && <Check className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const Header = ({ title, sub }: { title: string; sub: string }) => (
  <div className="text-center mb-8">
    <h1 className="font-body font-bold text-3xl md:text-4xl text-foreground tracking-[-0.02em] mb-3">{title}</h1>
    <p className="font-body text-muted-foreground">{sub}</p>
  </div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className={labelBase}>{label}</label>
    {children}
  </div>
);

const Row = ({ k, v }: { k: string; v: string }) => (
  <div className="flex items-center justify-between gap-4">
    <dt className="text-muted-foreground">{k}</dt>
    <dd className="text-foreground text-right">{v || "—"}</dd>
  </div>
);

export default B2BApply;
