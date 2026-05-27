import { useEffect, useState } from "react";
import CreatorLayout from "@/components/creator/CreatorLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DollarSign, MousePointerClick, ShoppingBag, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatCents, formatNumber, getCurrentAffiliate } from "@/lib/creator-utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CreatorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [affiliate, setAffiliate] = useState<any>(null);
  const [stats, setStats] = useState({ pending: 0, available: 0, paid: 0, clicks: 0, conversions: 0 });

  useEffect(() => {
    (async () => {
      const a = await getCurrentAffiliate();
      if (!a) return setLoading(false);
      setAffiliate(a);

      const { data: convs } = await supabase
        .from("affiliate_conversions")
        .select("status, commission_cents")
        .eq("affiliate_id", a.id);

      const { count: clickCount } = await supabase
        .from("affiliate_clicks")
        .select("id", { count: "exact", head: true })
        .eq("affiliate_id", a.id);

      const totals = (convs || []).reduce(
        (acc, c: any) => {
          if (c.status === "pending" || c.status === "approved") acc.pending += c.commission_cents;
          else if (c.status === "cleared") acc.available += c.commission_cents;
          else if (c.status === "paid") acc.paid += c.commission_cents;
          if (!["denied", "refunded", "reversed"].includes(c.status)) acc.conversions += 1;
          return acc;
        },
        { pending: 0, available: 0, paid: 0, conversions: 0 }
      );

      setStats({ ...totals, clicks: clickCount || 0 });
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <CreatorLayout>
        <Skeleton className="h-20 w-full mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32" />)}
        </div>
      </CreatorLayout>
    );
  }

  const kpis = [
    { label: "Available Balance", value: formatCents(stats.available), icon: DollarSign, accent: "text-emerald-500" },
    { label: "Pending Commissions", value: formatCents(stats.pending), icon: TrendingUp, accent: "text-amber-500" },
    { label: "Total Clicks", value: formatNumber(stats.clicks), icon: MousePointerClick },
    { label: "Conversions", value: formatNumber(stats.conversions), icon: ShoppingBag },
  ];

  return (
    <CreatorLayout>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display tracking-tight">
            Welcome back, <span className="italic text-muted-foreground">{affiliate?.display_name || affiliate?.name}</span>
          </h1>
          <p className="text-muted-foreground mt-1">Affiliate #{affiliate?.affiliate_number}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="capitalize">{affiliate?.tier} tier</Badge>
          <Badge variant="secondary">{(affiliate?.custom_commission_rate ?? affiliate?.commission_rate / 100) * 100 || affiliate?.commission_rate}% commission</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{k.label}</CardTitle>
              <k.icon className={`h-4 w-4 ${k.accent || "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-display tabular-nums">{k.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Get started</CardTitle>
            <CardDescription>Create your first tracking link or share your code.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full" variant="default"><Link to="/creator/links">Create a tracking link</Link></Button>
            <Button asChild className="w-full" variant="secondary"><Link to="/creator/codes">View your codes</Link></Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total lifetime paid</CardTitle>
            <CardDescription>Across every payout method.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-display tabular-nums">{formatCents(stats.paid)}</div>
          </CardContent>
        </Card>
      </div>
    </CreatorLayout>
  );
};

export default CreatorDashboard;
