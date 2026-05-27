import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Payout {
  id: string;
  affiliate_id: string;
  amount_cents: number;
  net_amount_cents: number;
  method: string;
  status: string;
  created_at: string;
  paid_at: string | null;
  failure_reason: string | null;
}

const statusColors: Record<string, string> = {
  queued: "bg-yellow-500/20 text-yellow-300",
  processing: "bg-blue-500/20 text-blue-300",
  paid: "bg-green-500/20 text-green-300",
  failed: "bg-red-500/20 text-red-300",
};

export default function AffiliatePayouts() {
  const [rows, setRows] = useState<Payout[]>([]);
  const [affiliates, setAffiliates] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const [{ data: payouts }, { data: affs }] = await Promise.all([
      supabase.from("affiliate_payouts").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("affiliates").select("id, display_name, name, email"),
    ]);
    setRows((payouts ?? []) as any);
    const map: Record<string, string> = {};
    (affs ?? []).forEach((a: any) => { map[a.id] = a.display_name || a.name || a.email; });
    setAffiliates(map);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const runPayouts = async () => {
    setProcessing(true);
    const { data, error } = await supabase.functions.invoke("affiliate-process-payouts");
    setProcessing(false);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      const created = (data?.results ?? []).filter((r: any) => !r.skipped).length;
      toast({ title: "Processed", description: `${created} payout(s) created` });
      load();
    }
  };

  const markPaid = async (id: string) => {
    const { error } = await supabase
      .from("affiliate_payouts")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Marked paid" }); load(); }
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">{rows.length} payouts</p>
          <div className="space-x-2">
            <Button onClick={load} variant="outline" size="sm">Refresh</Button>
            <Button onClick={runPayouts} disabled={processing}>{processing ? "Processing…" : "Run payout batch"}</Button>
          </div>
        </div>
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Affiliate</th>
                <th className="text-right p-3">Amount</th>
                <th className="text-left p-3">Method</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Paid</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">Loading…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">No payouts yet</td></tr>
              ) : rows.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="p-3">{format(new Date(r.created_at), "MMM d, HH:mm")}</td>
                  <td className="p-3">{affiliates[r.affiliate_id] ?? r.affiliate_id.slice(0, 8)}</td>
                  <td className="p-3 text-right">${(r.amount_cents / 100).toFixed(2)}</td>
                  <td className="p-3">{r.method}</td>
                  <td className="p-3"><Badge className={statusColors[r.status] ?? ""}>{r.status}</Badge></td>
                  <td className="p-3 text-muted-foreground">{r.paid_at ? format(new Date(r.paid_at), "MMM d") : "—"}</td>
                  <td className="p-3 text-right">
                    {r.status !== "paid" && <Button size="sm" variant="outline" onClick={() => markPaid(r.id)}>Mark paid</Button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
