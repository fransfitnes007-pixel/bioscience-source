import { useEffect, useState } from "react";
import CreatorLayout from "@/components/creator/CreatorLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { formatCents } from "@/lib/creator-utils";
import { Trophy } from "lucide-react";

const CreatorLeaderboard = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const { data } = await supabase
        .from("affiliate_conversions")
        .select("affiliate_id, net_amount_cents, commission_cents")
        .gte("created_at", since)
        .not("status", "in", "(denied,refunded,reversed)");

      const byAff: Record<string, { volume: number; commission: number; count: number }> = {};
      (data || []).forEach((c: any) => {
        const k = c.affiliate_id;
        byAff[k] ??= { volume: 0, commission: 0, count: 0 };
        byAff[k].volume += c.net_amount_cents;
        byAff[k].commission += c.commission_cents;
        byAff[k].count += 1;
      });

      const ids = Object.keys(byAff);
      const { data: affs } = ids.length
        ? await supabase.from("affiliates").select("id, display_name, name, tier, vanity_slug").in("id", ids)
        : { data: [] as any[] };

      const merged = (affs || []).map((a) => ({ ...a, ...byAff[a.id] })).sort((x: any, y: any) => y.volume - x.volume);
      setRows(merged);
      setLoading(false);
    })();
  }, []);

  return (
    <CreatorLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground mt-1">Top creators by volume in the last 30 days.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5" />Top 50</CardTitle>
          <CardDescription>Public to all approved creators.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? <Skeleton className="h-64 w-full" /> : rows.length === 0 ? (
            <p className="text-muted-foreground text-sm">No conversions in the window.</p>
          ) : (
            <div className="space-y-1">
              {rows.slice(0, 50).map((r: any, idx) => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent">
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground w-8 tabular-nums">#{idx + 1}</span>
                    <span className="font-medium">{r.display_name || r.name}</span>
                    <Badge variant="outline" className="capitalize">{r.tier}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="tabular-nums">{formatCents(r.volume)}</p>
                    <p className="text-xs text-muted-foreground">{r.count} conv.</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </CreatorLayout>
  );
};

export default CreatorLeaderboard;
