import { useEffect, useState } from "react";
import CreatorLayout from "@/components/creator/CreatorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { formatCents, getCurrentAffiliate } from "@/lib/creator-utils";

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  pending: "secondary",
  approved: "outline",
  cleared: "default",
  paid: "default",
  denied: "destructive",
  refunded: "destructive",
  reversed: "destructive",
};

const CreatorEarnings = () => {
  const [loading, setLoading] = useState(true);
  const [convs, setConvs] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const a = await getCurrentAffiliate();
      if (!a) return setLoading(false);
      const { data } = await supabase
        .from("affiliate_conversions")
        .select("*")
        .eq("affiliate_id", a.id)
        .order("created_at", { ascending: false })
        .limit(100);
      setConvs(data || []);
      setLoading(false);
    })();
  }, []);

  return (
    <CreatorLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display tracking-tight">Earnings</h1>
        <p className="text-muted-foreground mt-1">Every attributed conversion and its commission status.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Recent conversions</CardTitle></CardHeader>
        <CardContent>
          {loading ? <Skeleton className="h-64 w-full" /> : convs.length === 0 ? (
            <p className="text-muted-foreground text-sm py-6">No conversions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead className="text-right">Net</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">Commission</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {convs.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="text-muted-foreground text-sm">{new Date(c.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="font-mono text-xs">{c.order_id || c.stripe_checkout_session_id?.slice(0, 12) || "—"}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatCents(c.net_amount_cents)}</TableCell>
                      <TableCell className="text-right tabular-nums">{(c.commission_rate_used * 100).toFixed(1)}%</TableCell>
                      <TableCell className="text-right tabular-nums font-medium">{formatCents(c.commission_cents)}</TableCell>
                      <TableCell><Badge variant={statusVariant[c.status] || "outline"}>{c.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </CreatorLayout>
  );
};

export default CreatorEarnings;
