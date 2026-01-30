import { useEffect, useRef, useState } from "react";
import { Shield, Microscope, Clock, Globe, BadgeCheck, Lock, FlaskConical, Award, CheckCircle2, TrendingUp, Quote } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from "recharts";

const growthData = [
  { month: "Jan", revenue: 45 },
  { month: "Feb", revenue: 52 },
  { month: "Mar", revenue: 61 },
  { month: "Apr", revenue: 78 },
  { month: "May", revenue: 95 },
  { month: "Jun", revenue: 120 },
];

// Animated $ symbol overlay for the mountain chart
const AnimatedDollarSymbol = ({ isVisible }: { isVisible: boolean }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      return;
    }
    
    const totalDuration = 2500;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(elapsed / totalDuration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(eased);
      
      if (p < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    const timeout = setTimeout(() => {
      requestAnimationFrame(animate);
    }, 400);
    
    return () => clearTimeout(timeout);
  }, [isVisible]);
  
  if (!isVisible || progress === 0) return null;
  
  // Position: bottom-left to top-right
  const x = 5 + 85 * progress;
  const y = 85 - 70 * progress;
  
  // Color transition: red -> green after 25%
  const colorProgress = progress >= 0.25 ? Math.min((progress - 0.25) / 0.5, 1) : 0;
  const r = Math.round(239 - (239 - 34) * colorProgress);
  const g = Math.round(68 + (197 - 68) * colorProgress);
  const b = Math.round(68 + (94 - 68) * colorProgress);
  const color = `rgb(${r}, ${g}, ${b})`;
  
  return (
    <div
      className="absolute pointer-events-none font-heading font-bold text-lg"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        color: color,
        textShadow: `0 0 8px ${color}`,
      }}
    >
      $
    </div>
  );
};

const profitData = [
  { month: "Jan", profit: 30 },
  { month: "Feb", profit: 45 },
  { month: "Mar", profit: 58 },
  { month: "Apr", profit: 72 },
  { month: "May", profit: 89 },
  { month: "Jun", profit: 115 },
];

const testimonials = [
  {
    quote: "We reduced our procurement costs by over 60% while actually improving product quality. The COA documentation makes audits effortless.",
    author: "Dr. Sarah M.",
    role: "Medical Director, Aesthetics Practice",
    metric: "60%+",
    metricLabel: "Cost Reduction"
  },
  {
    quote: "Consistent 99%+ purity across every batch. Our research depends on reliable compounds—Point delivers every time.",
    author: "James K.",
    role: "Lab Manager, Biotech Research",
    metric: "99%+",
    metricLabel: "Purity Standard"
  },
  {
    quote: "From quote to delivery in under 72 hours. The speed and reliability have completely transformed our inventory management.",
    author: "Michelle R.",
    role: "Operations Lead, Wellness Clinic",
    metric: "<72h",
    metricLabel: "Avg. Turnaround"
  },
];

const certifications = [
  { icon: FlaskConical, label: "GMP Compliant" },
  { icon: Award, label: "ISO 9001" },
  { icon: CheckCircle2, label: "Lab Verified" },
  { icon: Shield, label: "COA Certified" },
];



const trustPoints = [
  {
    icon: BadgeCheck,
    title: "Verified Suppliers",
    description: "Every supplier in our network undergoes rigorous vetting for quality and compliance standards.",
  },
  {
    icon: Microscope,
    title: "Third-Party Testing",
    description: "All products include independent lab analysis with full COA documentation.",
  },
  {
    icon: Shield,
    title: "99.1%+ Purity",
    description: "We maintain strict purity standards across our entire research compound catalog.",
  },
  {
    icon: Clock,
    title: "Fast Turnaround",
    description: "Quotes within 24-72 hours. Streamlined fulfillment for approved partners.",
  },
  {
    icon: Globe,
    title: "Global Logistics",
    description: "Established shipping networks with proper handling and documentation.",
  },
  {
    icon: Lock,
    title: "Secure Transactions",
    description: "Encrypted communications and secure payment processing for all orders.",
  },
];

export const TrustSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-24 lg:py-32 border-t border-border/30 bg-molecular-grid">
      <div className="container mx-auto px-4 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold mb-4 text-foreground">
            Why Partners Trust Us
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Built on transparency, quality assurance, and reliable service for research businesses.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {trustPoints.map((point, index) => (
            <div
              key={point.title}
              className={`p-6 border border-border/50 rounded-lg bg-card/30 backdrop-blur-sm hover-lift transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <point.icon className="w-8 h-8 text-foreground/80 mb-4" strokeWidth={1.5} />
              <h3 className="font-heading text-lg font-medium mb-2 text-foreground">
                {point.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>

        {/* Certification Badges */}
        <div className={`mt-16 transition-all duration-700 delay-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
          <h3 className="font-heading text-lg font-medium text-center mb-8 text-muted-foreground">
            Quality & Compliance Standards
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {certifications.map((cert, index) => (
              <div
                key={cert.label}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-16 h-16 rounded-full border border-border/50 bg-card/50 flex items-center justify-center group-hover:border-foreground/30 transition-colors">
                  <cert.icon className="w-7 h-7 text-foreground/70" strokeWidth={1.5} />
                </div>
                <span className="font-body text-xs text-muted-foreground text-center max-w-[80px]">
                  {cert.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials with Metrics */}
        <div className={`mt-20 transition-all duration-700 delay-600 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
          <h3 className="font-heading text-2xl md:text-3xl font-semibold text-center mb-4 text-foreground">
            Partner Success Stories
          </h3>
          <p className="font-body text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            See how businesses are scaling their operations with our research compounds.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 border border-border/50 rounded-lg bg-card/30 backdrop-blur-sm relative group hover-lift"
              >
                <Quote className="w-8 h-8 text-foreground/10 absolute top-4 right-4" />
                <div className="mb-4">
                  <span className="font-heading text-3xl font-bold text-foreground">{testimonial.metric}</span>
                  <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">{testimonial.metricLabel}</p>
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <div className="pt-4 border-t border-border/30">
                  <p className="font-heading text-sm font-medium text-foreground">{testimonial.author}</p>
                  <p className="font-body text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Charts Section */}
        <div className={`mt-20 transition-all duration-700 delay-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
          <h3 className="font-heading text-2xl md:text-3xl font-semibold text-center mb-4 text-foreground">
            Accelerate Your Growth
          </h3>
          <p className="font-body text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Partners typically see significant revenue and margin improvements within the first 6 months.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Revenue Growth Chart */}
            <div className="p-6 border border-border/50 rounded-lg bg-card/30 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-foreground" />
                <h4 className="font-heading text-lg font-medium text-foreground">Revenue Growth</h4>
              </div>
              <p className="font-body text-sm text-muted-foreground mb-6">Average partner revenue trajectory (indexed)</p>
              <div className="h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={isVisible ? growthData : []}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity={0.6}/>
                        <stop offset="50%" stopColor="#eab308" stopOpacity={0.3}/>
                        <stop offset="100%" stopColor="#ef4444" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="revenueStroke" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#ef4444"/>
                        <stop offset="25%" stopColor="#f97316"/>
                        <stop offset="50%" stopColor="#eab308"/>
                        <stop offset="75%" stopColor="#84cc16"/>
                        <stop offset="100%" stopColor="#22c55e"/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <YAxis hide domain={[0, 'dataMax + 20']} />
                    <Area 
                      type="natural" 
                      dataKey="revenue" 
                      stroke="url(#revenueStroke)" 
                      strokeWidth={3}
                      fill="url(#revenueGradient)"
                      isAnimationActive={true}
                      animationBegin={0}
                      animationDuration={2000}
                      animationEasing="ease-out"
                      baseValue={0}
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <AnimatedDollarSymbol isVisible={isVisible} />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-body text-sm text-muted-foreground">6-month average</span>
                <span className="font-heading text-xl font-bold text-foreground">+167%</span>
              </div>
            </div>

            {/* Profit Margin Chart */}
            <div className="p-6 border border-border/50 rounded-lg bg-card/30 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-foreground" />
                <h4 className="font-heading text-lg font-medium text-foreground">Profit Margins</h4>
              </div>
              <p className="font-body text-sm text-muted-foreground mb-6">Average margin improvement (indexed)</p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={isVisible ? profitData : []}>
                    <defs>
                      <linearGradient id="profitStroke" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#ef4444"/>
                        <stop offset="100%" stopColor="#22c55e"/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <YAxis hide />
                    <Line 
                      type="monotone" 
                      dataKey="profit" 
                      stroke="url(#profitStroke)" 
                      strokeWidth={2}
                      dot={({ cx, cy, index }) => {
                        const colors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#22c55e'];
                        return <circle cx={cx} cy={cy} r={4} fill={colors[index]} />;
                      }}
                      activeDot={{ r: 6, fill: '#22c55e' }}
                      isAnimationActive={true}
                      animationBegin={200}
                      animationDuration={2000}
                      animationEasing="ease-out"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-body text-sm text-muted-foreground">Margin potential</span>
                <span className="font-heading text-xl font-bold text-foreground">300-500%</span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
            {[
              { value: "150+", label: "Active Partners" },
              { value: "$2.5M+", label: "Partner Revenue" },
              { value: "98%", label: "Retention Rate" },
              { value: "4.9/5", label: "Partner Rating" },
            ].map((stat, index) => (
              <div key={index} className="text-center p-4 border border-border/30 rounded-lg bg-card/20">
                <p className="font-heading text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
