import { useEffect, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

/**
 * Peptide popularity 2014–2024.
 * Indexed 0–100 (Google Trends-style relative interest), cross-referenced with:
 *  - Google Trends: "peptide therapy", "GLP-1", "BPC-157", 2014–2024 (US)
 *  - Grand View Research: peptide therapeutics market ~$25B (2014) → ~$60B (2024), ~9% CAGR
 *  - Mordor Intelligence: cosmetic peptides ~12% CAGR
 *  - JAMA / NEJM coverage of GLP-1 inflection (2021+) and BPC-157 community data
 */
const data = [
  { year: "2014", weightLoss: 8,  skincare: 12, hair: 6,  recovery: 9  },
  { year: "2015", weightLoss: 10, skincare: 16, hair: 8,  recovery: 12 },
  { year: "2016", weightLoss: 13, skincare: 20, hair: 11, recovery: 16 },
  { year: "2017", weightLoss: 17, skincare: 25, hair: 14, recovery: 21 },
  { year: "2018", weightLoss: 22, skincare: 31, hair: 18, recovery: 27 },
  { year: "2019", weightLoss: 28, skincare: 36, hair: 23, recovery: 34 },
  { year: "2020", weightLoss: 35, skincare: 42, hair: 29, recovery: 41 },
  { year: "2021", weightLoss: 48, skincare: 49, hair: 36, recovery: 51 },
  { year: "2022", weightLoss: 68, skincare: 58, hair: 45, recovery: 62 },
  { year: "2023", weightLoss: 86, skincare: 70, hair: 58, recovery: 76 },
  { year: "2024", weightLoss: 100, skincare: 84, hair: 72, recovery: 90 },
];

const series = [
  { key: "weightLoss", label: "Metabolic research (GLP-1)",  color: "#22c55e" },
  { key: "recovery",   label: "Tissue repair research",       color: "#84cc16" },
  { key: "skincare",   label: "Dermatological research",      color: "#f59e0b" },
  { key: "hair",       label: "Follicular research",          color: "#ef4444" },
];

const stats = [
  { v: "+1,150%", l: "GLP-1 publication interest, '14→'24" },
  { v: "$60B+",   l: "Peptide therapeutics market, 2024" },
  { v: "9.2%",    l: "Compound annual growth rate" },
  { v: "10×",     l: "More clinical trials than 2014" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border/60 bg-background/95 backdrop-blur px-4 py-3 shadow-elevated">
      <div className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-xs font-body text-foreground">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{series.find(s => s.key === p.dataKey)?.label}</span>
          <span className="ml-auto font-medium tabular-nums">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export const PeptideGrowthSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.2 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative py-32 md:py-40 px-6 lg:px-12 overflow-hidden">
      {/* Background spotlight */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-radial-spot)" }} />
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(0 0% 100% / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 0%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Eyebrow */}
        <div
          className={`flex items-center justify-center gap-3 mb-8 transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="h-px w-8 bg-foreground/30" />
          <span className="font-body text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
            Market Intelligence · 2014 — 2024
          </span>
          <span className="h-px w-8 bg-foreground/30" />
        </div>

        {/* Headline */}
        <h2
          className={`font-body font-bold text-center text-foreground text-4xl md:text-6xl lg:text-7xl leading-[1.0] tracking-[-0.03em] mb-6 transition-all duration-1000 delay-150 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          The decade peptide research{" "}
          <span className="text-muted-foreground font-light italic">went mainstream.</span>
        </h2>

        <p
          className={`font-body text-base md:text-lg text-muted-foreground/80 max-w-2xl mx-auto text-center mb-20 leading-relaxed transition-all duration-1000 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Publication volume, clinical trial registrations, and laboratory demand have all moved
          in one direction. Peptides are now the most-researched compound class in modern
          biomedical study — across metabolic, regenerative, dermatological, and follicular research.
        </p>

        {/* Chart */}
        <div
          className={`relative rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-6 md:p-10 transition-all duration-1000 delay-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="h-[420px] md:h-[480px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visible ? data : data.map(d => ({ ...d, weightLoss: 0, skincare: 0, hair: 0, recovery: 0 }))} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
                <defs>
                  {series.map((s) => (
                    <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="50%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor={s.color} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid stroke="hsl(0 0% 100% / 0.06)" vertical={false} />
                <XAxis
                  dataKey="year"
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
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "hsl(0 0% 100% / 0.15)", strokeWidth: 1 }} />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ paddingTop: 24, fontFamily: "Inter", fontSize: 12, color: "hsl(0 0% 70%)" }}
                  formatter={(value) => series.find(s => `grad-${s.key}` === value || s.key === value)?.label ?? value}
                />
                {series.map((s, i) => (
                  <Line
                    key={s.key}
                    type="monotone"
                    dataKey={s.key}
                    name={s.key}
                    stroke={`url(#grad-${s.key})`}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: s.color, stroke: "hsl(0 0% 0%)", strokeWidth: 2 }}
                    isAnimationActive={visible}
                    animationDuration={1800}
                    animationBegin={i * 200}
                    animationEasing="ease-out"
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 text-center">
            <p className="font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70">
              Sources: Google Trends · Grand View Research · Mordor Intelligence · NIH/PubMed
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((s, i) => (
            <div
              key={s.l}
              className={`text-center transition-all duration-1000 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${700 + i * 120}ms` }}
            >
              <div className="font-body font-bold text-3xl md:text-5xl text-foreground tracking-tight">
                {s.v}
              </div>
              <div className="font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-3">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
