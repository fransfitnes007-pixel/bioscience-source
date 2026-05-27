import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, Zap, Shield, Trophy } from "lucide-react";

const Affiliate = () => {
  const [tiers, setTiers] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("commission_tiers").select("*").order("commission_rate").then(({ data }) => setTiers(data || []));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-24 text-center max-w-3xl">
        <Badge variant="outline" className="mb-6">Creator Program</Badge>
        <h1 className="text-5xl md:text-7xl font-display tracking-tight mb-6">
          Get paid to share <span className="italic text-muted-foreground">what works.</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Earn up to 25% lifetime commission on every order from your audience. Stripe, USDC, or ACH — paid monthly.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Button asChild size="lg"><Link to="/affiliate-apply">Apply now</Link></Button>
          <Button asChild size="lg" variant="outline"><Link to="/creator/dashboard">Creator login</Link></Button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: DollarSign, title: "Up to 25%", body: "Lifetime commission on every conversion." },
            { icon: Zap, title: "90-day cookies", body: "Long attribution window — you still get paid weeks later." },
            { icon: Shield, title: "Code + link", body: "Discount codes work even without an affiliate click." },
            { icon: Trophy, title: "Tier rewards", body: "Bronze → Platinum with milestone bonuses." },
          ].map((f) => (
            <div key={f.title} className="text-center">
              <f.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-medium mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 max-w-5xl">
        <h2 className="text-3xl font-display tracking-tight text-center mb-10">Tier ladder</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {tiers.map((t) => (
            <Card key={t.id}>
              <CardHeader>
                <div className="w-8 h-8 rounded-full mb-2" style={{ background: t.badge_color }} />
                <CardTitle className="capitalize">{t.display_name}</CardTitle>
                <CardDescription>{(t.commission_rate * 100).toFixed(0)}% commission</CardDescription>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p className="text-muted-foreground">Unlock at ${(t.monthly_volume_threshold_cents / 100).toLocaleString()}/mo</p>
                <ul className="space-y-1">
                  {(t.perks || []).map((p: string) => <li key={p} className="text-xs">· {p}</li>)}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-display tracking-tight mb-4">Ready to earn?</h2>
        <Button asChild size="lg"><Link to="/affiliate-apply">Apply to the program</Link></Button>
      </section>
    </div>
  );
};

export default Affiliate;
