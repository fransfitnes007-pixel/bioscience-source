import { Shield, Truck, FlaskConical, Clock } from "lucide-react";

const announcements = [
  { icon: Truck, text: "Free Shipping on Orders $150+" },
  { icon: Clock, text: "24 Hour US Shipping" },
  { icon: FlaskConical, text: "99%+ Purity Research Peptides" },
  { icon: Shield, text: "3rd Party COA Every Order" },
  { icon: Truck, text: "Free Shipping on Orders $150+" },
  { icon: Clock, text: "24 Hour US Shipping" },
  { icon: FlaskConical, text: "99%+ Purity Research Peptides" },
  { icon: Shield, text: "3rd Party COA Every Order" },
];

export const AnnouncementBar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-foreground text-background overflow-hidden">
      <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap">
        {[...announcements, ...announcements].map((item, i) => (
          <div key={i} className="flex items-center gap-2 px-6 py-2 text-xs font-medium tracking-wide uppercase shrink-0">
            <item.icon className="w-3.5 h-3.5" strokeWidth={2} />
            <span>{item.text}</span>
            <span className="mx-4 text-background/30">·</span>
          </div>
        ))}
      </div>
    </div>
  );
};
