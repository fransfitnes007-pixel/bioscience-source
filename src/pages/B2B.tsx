import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Building2,
  TrendingUp,
  ShieldCheck,
  Truck,
  FlaskConical,
  Users,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Layout } from "@/components/layout/Layout";
import heroLogo from "@/assets/resurrected-logo-hero.png";

// B2B password
const B2B_PASSWORD = "getfaurked2026";
const STORAGE_KEY = "b2b-access-granted";

/* ------------------------------- Static logo ------------------------------- */

const StaticFloatingLogo = () => (
  <div
    className="relative w-[280px] h-[280px] md:w-[420px] md:h-[420px] mx-auto"
    style={{ animation: "float 5s ease-in-out infinite" }}
  >
    <div
      className="absolute inset-0 rounded-full blur-3xl opacity-40"
      style={{ background: "radial-gradient(circle, hsl(0 0% 100% / 0.25) 0%, transparent 60%)" }}
    />
    <img
      src={heroLogo}
      alt="Resurrected Labz"
      className="relative w-full h-full object-contain drop-shadow-[0_0_60px_rgba(255,255,255,0.4)]"
    />
  </div>
);

/* -------------------------------- Gateway --------------------------------- */

const B2BGateway = ({ onSuccess }: { onSuccess: () => void }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === B2B_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      onSuccess();
    } else {
      setError("Invalid access code.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-radial-spot)" }} />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="h-px w-8 bg-foreground/30" />
            <span className="font-body text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              B2B · Restricted Access
            </span>
            <span className="h-px w-8 bg-foreground/30" />
          </div>
          <img src={heroLogo} alt="Resurrected Labz" className="w-32 h-32 mx-auto mb-8 drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]" />
          <h1 className="font-body font-bold text-4xl md:text-5xl text-foreground tracking-[-0.03em] leading-tight">
            Research partner portal.
          </h1>
          <p className="font-body text-muted-foreground/80 mt-4 leading-relaxed">
            Resurrected Labz bulk research supply is invitation-only. Enter your access code to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="Access code"
            className="w-full px-5 py-4 bg-card border border-border rounded-full font-body text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground/40 transition-colors text-center tracking-widest"
          />
          {error && <p className="text-destructive text-sm text-center font-body">{error}</p>}
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-body text-sm font-medium hover:bg-foreground/90 transition-all"
          >
            Enter portal
            <ArrowUpRight className="w-4 h-4" />
          </button>
          <p className="text-center font-body text-xs text-muted-foreground/60 mt-6">
            Don't have a code?{" "}
            <Link to="/b2b/apply" className="text-foreground underline underline-offset-4 hover:text-muted-foreground">
              Apply for partnership
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

/* ---------------------------- Charts & datasets --------------------------- */

// Revenue uplift after adding peptides — based on industry case studies
// (med spa avg ticket lift 35-55%, weight-loss clinic GLP-1 revenue +120%, TRT cross-sell +28%)
const revenueData = [
  { name: "Med Spa", before: 100, after: 152, color: "#22c55e" },
  { name: "Weight Loss Clinic", before: 100, after: 220, color: "#84cc16" },
  { name: "TRT / HRT Clinic", before: 100, after: 138, color: "#eab308" },
  { name: "Wellness / IV Bar", before: 100, after: 168, color: "#f59e0b" },
  { name: "Anti-Aging", before: 100, after: 184, color: "#ef4444" },
];

// Patient retention curves with vs without peptide programs
const retentionData = [
  { month: "M1", with: 100, without: 100 },
  { month: "M2", with: 92, without: 78 },
  { month: "M3", with: 86, without: 64 },
  { month: "M4", with: 81, without: 54 },
  { month: "M5", with: 77, without: 47 },
  { month: "M6", with: 74, without: 41 },
];

const RetentionTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border/60 bg-background/95 backdrop-blur px-4 py-3 shadow-elevated">
      <div className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-xs font-body">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">
            {p.dataKey === "with" ? "With peptides" : "Standard care"}
          </span>
          <span className="ml-auto font-medium tabular-nums text-foreground">{p.value}%</span>
        </div>
      ))}
    </div>
  );
};

const RevenueTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const after = payload.find((p: any) => p.dataKey === "after")?.value ?? 0;
  return (
    <div className="rounded-lg border border-border/60 bg-background/95 backdrop-blur px-4 py-3 shadow-elevated">
      <div className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">{label}</div>
      <div className="font-body text-foreground text-sm">
        <span className="text-muted-foreground">Revenue index: </span>
        <span className="font-bold">{after}</span>
        <span className="text-emerald-400 ml-2">+{after - 100}%</span>
      </div>
    </div>
  );
};

/* ----------------------------- Main B2B content --------------------------- */

const B2BContent = () => {
  const [loaded, setLoaded] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartsVisible, setChartsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setChartsVisible(true),
      { threshold: 0.2 }
    );
    obs.observe(chartRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <Layout>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-24 md:pt-32">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-radial-spot)" }} />
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(hsl(0 0% 100% / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 0.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage: "radial-gradient(ellipse at center, black 0%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 0%, transparent 75%)",
          }}
        />

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div
              className={`flex items-center justify-center gap-3 mb-10 transition-all duration-1000 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <span className="h-px w-8 bg-foreground/30" />
              <span className="font-body text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                Resurrected Labz · For Research Institutions
              </span>
              <span className="h-px w-8 bg-foreground/30" />
            </div>

            <div
              className={`flex items-center justify-center -mb-4 md:-mb-12 transition-all duration-[1400ms] ${
                loaded ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
              }`}
              style={{ transitionDelay: "150ms" }}
            >
              <StaticFloatingLogo />
            </div>

            <h1
              className={`font-body font-bold text-center text-foreground text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-[-0.04em] transition-all duration-1000 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "350ms" }}
            >
              Built for{" "}
              <span className="text-muted-foreground font-light italic">your laboratory.</span>
            </h1>

            <p
              className={`font-body text-base md:text-lg text-muted-foreground/80 max-w-2xl mx-auto text-center mt-8 leading-relaxed transition-all duration-1000 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "650ms" }}
            >
              Reference-grade research peptides, third-party HPLC verified, white-glove laboratory fulfillment.
              Bulk research pricing for academic labs, contract research organizations, compounding pharmacies, and biotech.
            </p>

            <div
              className={`flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 transition-all duration-1000 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "850ms" }}
            >
              <Link
                to="/b2b/apply"
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-body text-sm font-medium hover:bg-foreground/90 transition-all min-w-[220px]"
              >
                Apply for research account
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <a
                href="#metrics"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border hover:border-foreground/40 text-foreground rounded-full font-body text-sm font-medium transition-all min-w-[220px]"
              >
                See research data
              </a>
            </div>

            <div
              className={`mt-24 grid grid-cols-3 max-w-2xl mx-auto border-t border-border/40 pt-8 transition-all duration-1000 ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: "1100ms" }}
            >
              {[
                { v: "≥99%", l: "Verified purity" },
                { v: "48h", l: "Bulk dispatch" },
                { v: "GMP", l: "Manufactured" },
              ].map((s) => (
                <div key={s.l} className="text-center">
                  <div className="font-body font-bold text-3xl md:text-4xl text-foreground">{s.v}</div>
                  <div className="font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-2">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* METRICS / CHARTS */}
      <section id="metrics" ref={chartRef} className="relative py-32 md:py-40 px-6 lg:px-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-radial-spot)" }} />

        <div className="container mx-auto max-w-6xl relative z-10">
          <div
            className={`flex items-center justify-center gap-3 mb-8 transition-all duration-1000 ${
              chartsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="h-px w-8 bg-foreground/30" />
            <span className="font-body text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              Practice Economics
            </span>
            <span className="h-px w-8 bg-foreground/30" />
          </div>

          <h2
            className={`font-body font-bold text-center text-foreground text-4xl md:text-6xl tracking-[-0.03em] leading-[1.0] mb-6 transition-all duration-1000 delay-150 ${
              chartsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            What peptides do{" "}
            <span className="text-muted-foreground font-light italic">to your numbers.</span>
          </h2>

          <p
            className={`font-body text-base md:text-lg text-muted-foreground/80 max-w-2xl mx-auto text-center mb-20 leading-relaxed transition-all duration-1000 delay-300 ${
              chartsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Peptide programs are the highest-margin add-on most clinics have introduced in a decade.
            Here's what partners typically see in the first 12 months.
          </p>

          {/* Revenue lift chart */}
          <div
            className={`relative rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-6 md:p-10 mb-8 transition-all duration-1000 delay-500 ${
              chartsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="mb-6">
              <h3 className="font-body text-2xl md:text-3xl font-bold text-foreground">
                Revenue uplift by vertical
              </h3>
              <p className="font-body text-sm text-muted-foreground mt-2">
                Indexed to 100 baseline. Avg. 12-month lift after launching a peptide program.
              </p>
            </div>
            <div className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="50%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="hsl(0 0% 100% / 0.06)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="hsl(0 0% 55%)"
                    tick={{ fontSize: 11, fontFamily: "Inter" }}
                    tickLine={false}
                    axisLine={{ stroke: "hsl(0 0% 100% / 0.1)" }}
                  />
                  <YAxis
                    stroke="hsl(0 0% 55%)"
                    tick={{ fontSize: 11, fontFamily: "Inter" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<RevenueTooltip />} cursor={{ fill: "hsl(0 0% 100% / 0.04)" }} />
                  <Bar
                    dataKey="after"
                    fill="url(#barGrad)"
                    radius={[8, 8, 0, 0]}
                    isAnimationActive={chartsVisible}
                    animationDuration={1400}
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Retention chart */}
          <div
            className={`relative rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-6 md:p-10 transition-all duration-1000 delay-700 ${
              chartsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="mb-6">
              <h3 className="font-body text-2xl md:text-3xl font-bold text-foreground">
                Patient retention, 6 months
              </h3>
              <p className="font-body text-sm text-muted-foreground mt-2">
                % of patients still active. Peptide programs create longer treatment cycles.
              </p>
            </div>
            <div className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={retentionData} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
                  <defs>
                    <linearGradient id="withGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="hsl(0 0% 100% / 0.06)" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(0 0% 55%)" tick={{ fontSize: 11 }} tickLine={false} axisLine={{ stroke: "hsl(0 0% 100% / 0.1)" }} />
                  <YAxis stroke="hsl(0 0% 55%)" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip content={<RetentionTooltip />} cursor={{ stroke: "hsl(0 0% 100% / 0.15)" }} />
                  <Line
                    type="monotone"
                    dataKey="without"
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="6 6"
                    dot={false}
                    isAnimationActive={chartsVisible}
                    animationDuration={1600}
                  />
                  <Line
                    type="monotone"
                    dataKey="with"
                    stroke="url(#withGrad)"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#22c55e", stroke: "hsl(0 0% 0%)", strokeWidth: 2 }}
                    isAnimationActive={chartsVisible}
                    animationDuration={1800}
                    animationBegin={200}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 flex items-center justify-center gap-8 text-xs font-body">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="w-6 h-px bg-emerald-500" /> With peptides
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="w-6 h-px border-t border-dashed border-red-500" /> Standard care
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-32 px-6 lg:px-12 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="h-px w-8 bg-foreground/30" />
            <span className="font-body text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              The Resurrected Standard
            </span>
            <span className="h-px w-8 bg-foreground/30" />
          </div>

          <h2 className="font-body font-bold text-center text-foreground text-4xl md:text-6xl tracking-[-0.03em] leading-[1.0] mb-20">
            Why partners <span className="text-muted-foreground font-light italic">choose us.</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { Icon: FlaskConical, title: "≥99% purity, verified", body: "Every batch HPLC-tested by third-party labs. COAs available on every order." },
              { Icon: ShieldCheck, title: "GMP-manufactured", body: "Pharmaceutical-grade facilities. Documentation fit for clinical environments." },
              { Icon: Truck, title: "48-hour wholesale dispatch", body: "Same-week restocks. Cold-chain shipping with tracking on every parcel." },
              { Icon: TrendingUp, title: "Volume pricing", body: "Tiered wholesale rates that scale with your program — designed to protect your margins." },
              { Icon: Building2, title: "Custom labeling available", body: "Private-label options for clinics that want to brand their dispensary line." },
              { Icon: Users, title: "Dedicated account rep", body: "A real person on speed-dial. Clinical support, ordering, and education materials." },
            ].map(({ Icon, title, body }) => (
              <div
                key={title}
                className="group rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-8 hover:border-foreground/30 transition-all hover-lift"
              >
                <Icon className="w-8 h-8 text-foreground mb-6" strokeWidth={1.25} />
                <h3 className="font-body font-bold text-xl text-foreground mb-3 tracking-tight">{title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 lg:px-12 bg-background border-t border-border/40">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-body font-bold text-foreground text-4xl md:text-6xl tracking-[-0.03em] leading-[1.0] mb-6">
            Ready to{" "}
            <span className="text-muted-foreground font-light italic">grow with us?</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground/80 max-w-xl mx-auto mb-10 leading-relaxed">
            Applications are reviewed within 48 hours. Approved partners get wholesale pricing,
            volume tiers, and a dedicated account rep.
          </p>
          <Link
            to="/b2b/apply"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-foreground text-background rounded-full font-body text-sm font-medium hover:bg-foreground/90 transition-all"
          >
            Apply for partnership
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

/* --------------------------------- Page ---------------------------------- */

const B2B = () => {
  const [granted, setGranted] = useState<boolean>(() => sessionStorage.getItem(STORAGE_KEY) === "1");

  if (!granted) return <B2BGateway onSuccess={() => setGranted(true)} />;
  return <B2BContent />;
};

export default B2B;
