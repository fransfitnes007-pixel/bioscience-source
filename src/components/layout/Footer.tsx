import { Link } from "react-router-dom";
import { Mail, Instagram } from "lucide-react";

export const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/40 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 py-20 lg:py-28">
        {/* Wordmark */}
        <div className="mb-20">
          <div className="font-body font-bold tracking-[-0.05em] text-[18vw] md:text-[14vw] lg:text-[12rem] leading-none text-foreground/[0.08] select-none">
            RESURRECTED
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-12 gap-12 md:gap-8">
          <div className="col-span-2 md:col-span-5">
            <p className="font-display text-2xl md:text-3xl text-foreground leading-tight max-w-md mb-8">
              Premium research peptides, <em className="italic text-muted-foreground">honestly delivered.</em>
            </p>
            <div className="flex items-center gap-4">
              <a href="#" aria-label="Instagram" className="w-10 h-10 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors">
                <Instagram size={16} strokeWidth={1.5} />
              </a>
              <a href="mailto:support@resurrected.com" aria-label="Email" className="w-10 h-10 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors">
                <Mail size={16} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <h4 className="font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">Explore</h4>
            <nav className="flex flex-col gap-3">
              {[
                { to: "/", label: "Home" },
                { to: "/products", label: "Catalog" },
                { to: "/about", label: "About" },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="font-body text-foreground hover:text-muted-foreground text-sm transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">Legal</h4>
            <nav className="flex flex-col gap-3">
              {[
                { to: "/terms", label: "Terms of Service" },
                { to: "/privacy", label: "Privacy Policy" },
                { to: "mailto:support@resurrected.com", label: "Support" },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="font-body text-foreground hover:text-muted-foreground text-sm transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="border-t border-border/40 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-muted-foreground/60 text-xs tracking-wide">
            © {year} Resurrected Labz. All rights reserved.
          </p>
          <p className="font-body text-muted-foreground/60 text-xs tracking-wide">
            For research purposes only · Not for human consumption
          </p>
        </div>
      </div>
    </footer>
  );
};
