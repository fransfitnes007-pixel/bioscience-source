import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle2, Instagram, Youtube, Sparkles, DollarSign, TrendingUp, ShieldCheck } from "lucide-react";
import SignatureModal from "@/components/agreements/SignatureModal";
import { expectedInitials, AGREEMENT_VERSIONS } from "@/lib/agreements";

const schema = z.object({
  name: z.string().trim().min(2, "Full name required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  phone: z.string().trim().min(7, "Valid phone required").max(30),
  content_niche: z.string().trim().min(2, "Tell us your niche").max(150),
  audience_size: z.string().trim().min(1, "Required").max(50),
  instagram: z.string().trim().max(150).optional().or(z.literal("")),
  tiktok: z.string().trim().max(150).optional().or(z.literal("")),
  youtube: z.string().trim().max(150).optional().or(z.literal("")),
  viral_video_links: z.string().trim().max(2000).optional().or(z.literal("")),
  portfolio_url: z.string().trim().max(500).optional().or(z.literal("")),
  why_join: z.string().trim().min(20, "Tell us a bit more (20+ chars)").max(2000),
});

const AffiliateApply = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  const [agreementSig, setAgreementSig] = useState<{ initials: string; signedAt: string } | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    content_niche: "",
    audience_size: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    viral_video_links: "",
    portfolio_url: "",
    why_join: "",
  });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: "Please review your application",
        description: parsed.error.errors[0]?.message || "Some fields are invalid",
        variant: "destructive",
      });
      return;
    }
    if (!agreementSig) {
      toast({
        title: "Sign the Creator Agreement",
        description: "You must review and sign the Creator Campaign Agreement before applying.",
        variant: "destructive",
      });
      setShowAgreement(true);
      return;
    }
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setLoading(false);
      toast({
        title: "Sign in to apply",
        description: "Create a free account first so we can link your application and follow up with you.",
      });
      navigate(`/account?redirect=${encodeURIComponent("/affiliate-apply")}`);
      return;
    }
    const { error } = await supabase.from("affiliates").insert({
      user_id: session.user.id,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      content_niche: parsed.data.content_niche,
      audience_size: parsed.data.audience_size,
      instagram: parsed.data.instagram || null,
      tiktok: parsed.data.tiktok || null,
      youtube: parsed.data.youtube || null,
      viral_video_links: parsed.data.viral_video_links || null,
      portfolio_url: parsed.data.portfolio_url || null,
      why_join: parsed.data.why_join,
      status: "pending",
      is_active: false,
      commission_rate: 10,
      application_notes: `Creator Agreement ${AGREEMENT_VERSIONS.creator_campaign} reviewed and initialed "${agreementSig.initials}" at ${agreementSig.signedAt}. Formal counter-signature pending after account creation.`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Submission failed", description: error.message, variant: "destructive" });
      return;
    }
    // Fire-and-forget confirmation email
    supabase.functions.invoke("affiliate-notify", {
      body: {
        type: "application_received",
        email: parsed.data.email,
        display_name: parsed.data.name,
      },
    }).catch((err) => console.warn("notify failed", err));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Layout>
        <section className="min-h-[80vh] flex items-center justify-center px-6 py-24">
          <div className="max-w-xl text-center">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-6 text-foreground" strokeWidth={1.2} />
            <h1 className="font-body font-bold text-4xl md:text-5xl tracking-tight mb-4">
              Application received.
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Thanks for applying to the Resurrected Labz creator program. Our team reviews every application
              personally — you'll hear back within 3–5 business days at the email you provided.
            </p>
            <Button onClick={() => navigate("/")} className="rounded-full px-8">
              Back to home
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="relative pt-32 pb-24 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors mb-12"
          >
            <ArrowLeft className="w-3 h-3" /> Back
          </Link>

          {/* Hero */}
          <div className="mb-16 text-center">
            <span className="inline-block font-body text-[10px] uppercase tracking-[0.4em] text-muted-foreground border border-border/50 rounded-full px-4 py-1.5 mb-6">
              Creator Program
            </span>
            <h1 className="font-body font-bold text-5xl md:text-7xl leading-[0.95] tracking-[-0.04em] mb-6">
              Become an <span className="italic font-light text-muted-foreground">affiliate.</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground/80 max-w-xl mx-auto leading-relaxed">
              Earn commission on every order driven by your unique code. Built for creators in fitness,
              biohacking, recovery, and longevity.
            </p>
          </div>

          {/* Perks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
            {[
              { icon: DollarSign, title: "Up to 30% commission", desc: "Tier-based on volume & content quality" },
              { icon: Sparkles, title: "Custom discount code", desc: "Your audience saves, you get paid" },
              { icon: TrendingUp, title: "Real-time tracking", desc: "See sales as they happen" },
            ].map((p) => (
              <div key={p.title} className="border border-border/40 rounded-2xl p-5 bg-card/30">
                <p.icon className="w-4 h-4 mb-3 text-foreground" strokeWidth={1.5} />
                <div className="font-body font-semibold text-sm mb-1">{p.title}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{p.desc}</div>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h2 className="font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-5">
                01 — About you
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Full name *</Label>
                  <Input value={form.name} onChange={update("name")} className="mt-1.5" required />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Email *</Label>
                  <Input type="email" value={form.email} onChange={update("email")} className="mt-1.5" required />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Phone *</Label>
                  <Input type="tel" value={form.phone} onChange={update("phone")} className="mt-1.5" required />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Content niche *</Label>
                  <Input
                    value={form.content_niche}
                    onChange={update("content_niche")}
                    placeholder="e.g. Bodybuilding, biohacking, MMA"
                    className="mt-1.5"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Total audience size (across platforms) *
                  </Label>
                  <Input
                    value={form.audience_size}
                    onChange={update("audience_size")}
                    placeholder="e.g. 250K combined followers"
                    className="mt-1.5"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-5">
                02 — Social handles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Instagram className="w-3 h-3" /> Instagram
                  </Label>
                  <Input value={form.instagram} onChange={update("instagram")} placeholder="@handle" className="mt-1.5" />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">TikTok</Label>
                  <Input value={form.tiktok} onChange={update("tiktok")} placeholder="@handle" className="mt-1.5" />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Youtube className="w-3 h-3" /> YouTube
                  </Label>
                  <Input value={form.youtube} onChange={update("youtube")} placeholder="Channel name or URL" className="mt-1.5" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-5">
                03 — Your work
              </h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Links to viral peptide / fitness content
                  </Label>
                  <Textarea
                    value={form.viral_video_links}
                    onChange={update("viral_video_links")}
                    placeholder="Paste URLs to your best-performing posts (one per line)"
                    rows={4}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Media kit / portfolio URL
                  </Label>
                  <Input
                    value={form.portfolio_url}
                    onChange={update("portfolio_url")}
                    placeholder="https://..."
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Why do you want to partner with Resurrected Labz? *
                  </Label>
                  <Textarea
                    value={form.why_join}
                    onChange={update("why_join")}
                    placeholder="Tell us about your audience, why peptides resonate with them, and how you'd promote us."
                    rows={5}
                    className="mt-1.5"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border/40 space-y-4">
              <div className={`rounded-lg border p-4 ${agreementSig ? "border-emerald-500/40 bg-emerald-500/5" : "border-border bg-secondary/20"}`}>
                {agreementSig ? (
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-heading text-sm font-semibold">Creator Agreement signed</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Initialed <span className="font-display tracking-widest">{agreementSig.initials}</span> on {new Date(agreementSig.signedAt).toLocaleString()}.
                        Admin will counter-sign on approval.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAgreement(true)}
                      className="text-xs underline text-muted-foreground hover:text-foreground"
                    >
                      Re-sign
                    </button>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="font-heading text-sm font-semibold">
                        Sign the Creator Campaign Agreement
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Required to apply. Review the full agreement and initial electronically.
                        Expected initials: <span className="font-display">{expectedInitials(form.name) || "—"}</span>
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        if (!form.name.trim()) {
                          toast({ title: "Enter your full name first", variant: "destructive" });
                          return;
                        }
                        setShowAgreement(true);
                      }}
                    >
                      Review & Sign
                    </Button>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading || !agreementSig}
                className="w-full md:w-auto rounded-full px-10 py-6 text-sm font-medium tracking-wide"
              >
                {loading ? "Submitting…" : "Submit application"}
              </Button>
              <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                By submitting, you agree to our partner terms. We review every application and will reach out
                within 3–5 business days.
              </p>
            </div>
          </form>

          <SignatureModal
            open={showAgreement}
            onOpenChange={setShowAgreement}
            type="creator_campaign"
            signerName={form.name}
            signerEmail={form.email}
            persist={false}
            onSigned={(sig) => setAgreementSig({ initials: sig.initials, signedAt: sig.signedAt })}
            ctaLabel="Sign Creator Agreement"
          />
        </div>
      </section>
    </Layout>
  );
};

export default AffiliateApply;
