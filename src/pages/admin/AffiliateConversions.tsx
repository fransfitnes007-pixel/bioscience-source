import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Conversion {
  id: string;
  affiliate_id: string;
  customer_email: string | null;
  gross_amount_cents: number;
  commission_cents: number;
  commission_rate_used: number;
  status: string;
  hold_until: string | null;
  created_at: string;
  stripe_checkout_session_id: string | null;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-300",
  approved: "bg-blue-500/20 text-blue-300",
  paid: "bg-green-500/20 text-green-300",
  refunded: "bg-red-500/20 text-red-300",
  reversed: "bg-red-500/20 text-red-300",
  cleared: "bg-emerald-500/20 text-emerald-300",
};

export default function AffiliateConversions() {
  const [rows, setRows] = useState<Conversion[]>([]);
  const [affiliates, setAffiliates] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const [{ data: convs }, { data: affs }] = await Promise.all([
      supabase.from("affiliate_conversions").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("affiliates").select("id, display_name, name, email"),
    ]);
    setRows((convs ?? []) as any);
    const map: Record<string, string> = {};
    (affs ?? []).forEach((a: any) => { map[a.id] = a.display_name || a.name || a.email; });
    setAffiliates(map);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const patch: any = { status };
    if (status === "approved") patch.approved_at = new Date().toISOString();
    if (status === "reversed") patch.reversal_reason = "admin_reversed";
    const { error } = await supabase.from("affiliate_conversions").update(patch).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Updated" }); load(); }
  };

  return (
    <AdminLayout title="Affiliate Conversions">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">{rows.length} conversions</p>
          <Button onClick={load} variant="outline" size="sm">Refresh</Button>
        </div>
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Affiliate</th>
                <th className="text-left p-3">Customer</th>
                <th className="text-right p-3">Gross</th>
                <th className="text-right p-3">Commission</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Hold Until</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">Loading…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">No conversions yet</td></tr>
              ) : rows.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="p-3">{format(new Date(r.created_at), "MMM d, HH:mm")}</td>
                  <td className="p-3">{affiliates[r.affiliate_id] ?? r.affiliate_id.slice(0, 8)}</td>
                  <td className="p-3">{r.customer_email ?? "—"}</td>
                  <td className="p-3 text-right">${(r.gross_amount_cents / 100).toFixed(2)}</td>
                  <td className="p-3 text-right">${(r.commission_cents / 100).toFixed(2)} <span className="text-muted-foreground">({(r.commission_rate_used * 100).toFixed(0)}%)</span></td>
                  <td className="p-3"><Badge className={statusColors[r.status] ?? ""}>{r.status}</Badge></td>
                  <td className="p-3 text-muted-foreground">{r.hold_until ? format(new Date(r.hold_until), "MMM d") : "—"}</td>
                  <td className="p-3 text-right space-x-1">
                    {r.status === "pending" && <Button size="sm" variant="outline" onClick={() => updateStatus(r.id, "approved")}>Approve</Button>}
                    {(r.status === "pending" || r.status === "approved") && <Button size="sm" variant="ghost" onClick={() => updateStatus(r.id, "reversed")}>Reverse</Button>}
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
