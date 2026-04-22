import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const businessTypes = [
  "Academic Research Laboratory",
  "Contract Research Organization (CRO)",
  "Compounding Pharmacy",
  "Biotech / Pharmaceutical R&D",
  "Government / Institutional Lab",
  "Independent Research Facility",
  "Distributor (Research Supply)",
  "Other",
];

const monthlyVolumes = [
  "$1k – $5k",
  "$5k – $15k",
  "$15k – $50k",
  "$50k – $150k",
  "$150k+",
];

const B2BApply = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
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
    monthlyVolume: "",
    howWeBenefit: "",
    notes: "",
  });

  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
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
        monthly_volume: form.monthlyVolume || null,
        how_we_benefit: form.howWeBenefit || null,
        notes: form.notes || null,
        referral_source: "B2B Page",
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

  const inputClass =
    "w-full px-4 py-3 bg-card border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/40 transition-colors";
  const labelClass = "font-body text-sm font-medium text-foreground block mb-2";

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
              Our partnerships team will review your application within 48 hours and reach out with next steps,
              your wholesale pricing tier, and an access code for the partner portal.
            </p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-body text-sm font-medium hover:bg-foreground/90 transition-all"
            >
              Back to home
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-24 md:py-32 px-6 lg:px-12">
        <div className="max-w-2xl mx-auto">
          <Link
            to="/b2b"
            className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" /> Back to partner portal
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-foreground/30" />
            <span className="font-body text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              Research Account Application
            </span>
          </div>

          <h1 className="font-body font-bold text-4xl md:text-6xl text-foreground tracking-[-0.03em] leading-[1.0] mb-6">
            Apply for{" "}
            <span className="text-muted-foreground font-light italic">research access.</span>
          </h1>
          <p className="font-body text-muted-foreground/80 mb-12 leading-relaxed">
            Tell us about your laboratory or institution. We review every application within 48 hours.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Institution / lab name *</label>
                <input required value={form.businessName} onChange={(e) => update("businessName", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Institution type *</label>
                <select required value={form.businessType} onChange={(e) => update("businessType", e.target.value)} className={inputClass}>
                  <option value="">Select…</option>
                  {businessTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {/* Contact */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Principal investigator / contact name *</label>
                <input required value={form.contactName} onChange={(e) => update("contactName", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Institutional email *</label>
                <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Website</label>
                <input value={form.website} onChange={(e) => update("website", e.target.value)} placeholder="https://" className={inputClass} />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className={labelClass}>Laboratory shipping address</label>
              <input value={form.businessAddress} onChange={(e) => update("businessAddress", e.target.value)} className={inputClass} />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <input value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="City" className={inputClass} />
              <input value={form.state} onChange={(e) => update("state", e.target.value)} placeholder="State" className={inputClass} />
              <input value={form.zipCode} onChange={(e) => update("zipCode", e.target.value)} placeholder="Zip" className={inputClass} />
            </div>

            {/* Volume */}
            <div>
              <label className={labelClass}>Estimated monthly research volume *</label>
              <select required value={form.monthlyVolume} onChange={(e) => update("monthlyVolume", e.target.value)} className={inputClass}>
                <option value="">Select…</option>
                {monthlyVolumes.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            {/* Interest */}
            <div>
              <label className={labelClass}>Which research compounds are you most interested in?</label>
              <textarea
                rows={3}
                value={form.productsInterest}
                onChange={(e) => update("productsInterest", e.target.value)}
                placeholder="GLP-1 (Semaglutide, Tirzepatide), BPC-157, TB-500, NAD+, etc."
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Describe your intended research use *</label>
              <textarea
                rows={4}
                value={form.howWeBenefit}
                onChange={(e) => update("howWeBenefit", e.target.value)}
                placeholder="In vitro assays, receptor binding studies, stability testing, etc. Include institution, IRB / ethics oversight if applicable."
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Anything else we should know?</label>
              <textarea rows={3} value={form.notes} onChange={(e) => update("notes", e.target.value)} className={inputClass} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-body text-sm font-medium hover:bg-foreground/90 transition-all disabled:opacity-50"
            >
              {loading ? "Submitting…" : "Submit application"}
              {!loading && <ArrowUpRight className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default B2BApply;
