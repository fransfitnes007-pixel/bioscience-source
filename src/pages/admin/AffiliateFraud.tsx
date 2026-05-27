import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface FraudEvent {
  id: string;
  affiliate_id: string | null;
  event_type: string;
  severity: string;
  status: string;
  details: any;
  created_at: string;
  action_taken: string | null;
}

const sev: Record<string, string> = {
  low: "bg-yellow-500/20 text-yellow-300",
  medium: "bg-orange-500/20 text-orange-300",
  high: "bg-red-500/20 text-red-300",
  critical: "bg-red-600/30 text-red-200",
};

export default function AffiliateFraud() {
  const [rows, setRows] = useState<FraudEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("fraud_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    setRows((data ?? []) as any);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const resolve = async (id: string, action: string) => {
    const { error } = await supabase.from("fraud_events").update({
      status: "resolved",
      action_taken: action,
      reviewed_at: new Date().toISOString(),
    }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Resolved" }); load(); }
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">{rows.length} events</p>
          <Button onClick={load} variant="outline" size="sm">Refresh</Button>
        </div>
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Severity</th>
                <th className="text-left p-3">Affiliate</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Details</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">Loading…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">No fraud events</td></tr>
              ) : rows.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="p-3">{format(new Date(r.created_at), "MMM d, HH:mm")}</td>
                  <td className="p-3">{r.event_type}</td>
                  <td className="p-3"><Badge className={sev[r.severity] ?? ""}>{r.severity}</Badge></td>
                  <td className="p-3 text-muted-foreground">{r.affiliate_id?.slice(0, 8) ?? "—"}</td>
                  <td className="p-3">{r.status}</td>
                  <td className="p-3 max-w-xs truncate text-muted-foreground">{JSON.stringify(r.details)}</td>
                  <td className="p-3 text-right space-x-1">
                    {r.status === "open" && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => resolve(r.id, "dismissed")}>Dismiss</Button>
                        <Button size="sm" variant="destructive" onClick={() => resolve(r.id, "affiliate_suspended")}>Suspend</Button>
                      </>
                    )}
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
