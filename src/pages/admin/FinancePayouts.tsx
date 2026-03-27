import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, Loader2, ArrowLeft, Check, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const FinancePayouts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>("all");
  const [showPayDialog, setShowPayDialog] = useState(false);
  const [selectedAffiliate, setSelectedAffiliate] = useState<string | null>(null);

  // Get all affiliates with pending earnings
  const { data: affiliates } = useQuery({
    queryKey: ["payout-affiliates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("affiliates")
        .select("*")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  // Get all earnings
  const { data: earnings, isLoading } = useQuery({
    queryKey: ["payout-earnings", filter],
    queryFn: async () => {
      let query = supabase
        .from("affiliate_earnings")
        .select("*, affiliates(name, email, commission_rate, discount_code)")
        .order("created_at", { ascending: false });

      if (filter === "pending") query = query.eq("status", "pending");
      if (filter === "paid") query = query.eq("status", "paid");

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Get pending earnings grouped by affiliate
  const pendingByAffiliate = earnings
    ?.filter(e => e.status === "pending")
    .reduce((acc, e) => {
      const id = e.affiliate_id;
      if (!acc[id]) acc[id] = { total: 0, count: 0, name: (e as any).affiliates?.name || "", email: (e as any).affiliates?.email || "", ids: [] as string[] };
      acc[id].total += Number(e.commission_amount);
      acc[id].count++;
      acc[id].ids.push(e.id);
      return acc;
    }, {} as Record<string, { total: number; count: number; name: string; email: string; ids: string[] }>) || {};

  // Pay out an affiliate
  const payoutMutation = useMutation({
    mutationFn: async (affiliateId: string) => {
      const group = pendingByAffiliate[affiliateId];
      if (!group) throw new Error("No pending earnings");

      // Mark all pending earnings as paid
      const { error: earningsErr } = await supabase
        .from("affiliate_earnings")
        .update({ status: "paid", paid_at: new Date().toISOString() })
        .in("id", group.ids);
      if (earningsErr) throw earningsErr;

      // Update affiliate total_earnings
      const affiliate = affiliates?.find(a => a.id === affiliateId);
      if (affiliate) {
        const { error: affErr } = await supabase
          .from("affiliates")
          .update({ total_earnings: Number(affiliate.total_earnings) + group.total })
          .eq("id", affiliateId);
        if (affErr) throw affErr;
      }

      return group;
    },
    onSuccess: (group) => {
      toast({ title: "Payout recorded", description: `$${group.total.toFixed(2)} marked as paid to ${group.name}.` });
      queryClient.invalidateQueries({ queryKey: ["payout-earnings"] });
      queryClient.invalidateQueries({ queryKey: ["payout-affiliates"] });
      queryClient.invalidateQueries({ queryKey: ["finance-overview"] });
      queryClient.invalidateQueries({ queryKey: ["admin-affiliates"] });
      setShowPayDialog(false);
      setSelectedAffiliate(null);
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const payAllMutation = useMutation({
    mutationFn: async () => {
      const allPendingIds = earnings?.filter(e => e.status === "pending").map(e => e.id) || [];
      if (!allPendingIds.length) throw new Error("No pending earnings");

      const { error } = await supabase
        .from("affiliate_earnings")
        .update({ status: "paid", paid_at: new Date().toISOString() })
        .in("id", allPendingIds);
      if (error) throw error;

      // Update each affiliate's total
      for (const [affId, group] of Object.entries(pendingByAffiliate)) {
        const affiliate = affiliates?.find(a => a.id === affId);
        if (affiliate) {
          await supabase
            .from("affiliates")
            .update({ total_earnings: Number(affiliate.total_earnings) + group.total })
            .eq("id", affId);
        }
      }
    },
    onSuccess: () => {
      toast({ title: "All payouts recorded", description: "All pending earnings marked as paid." });
      queryClient.invalidateQueries({ queryKey: ["payout-earnings"] });
      queryClient.invalidateQueries({ queryKey: ["payout-affiliates"] });
      queryClient.invalidateQueries({ queryKey: ["finance-overview"] });
      queryClient.invalidateQueries({ queryKey: ["admin-affiliates"] });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const totalPending = Object.values(pendingByAffiliate).reduce((s, g) => s + g.total, 0);
  const totalPaid = earnings?.filter(e => e.status === "paid").reduce((s, e) => s + Number(e.commission_amount), 0) || 0;

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/admin/finance")} className="p-1 hover:bg-secondary rounded">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <DollarSign className="h-5 w-5 text-foreground" />
          <h1 className="text-xl font-semibold text-foreground">Payouts</h1>
        </div>

        {/* Summary */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">To be paid</p>
              <p className="text-2xl font-semibold text-foreground">${totalPending.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total paid out</p>
              <p className="text-2xl font-semibold text-foreground">${totalPaid.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Pending payouts by affiliate */}
        {Object.keys(pendingByAffiliate).length > 0 && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Pending payouts by affiliate</h2>
              <Button
                size="sm"
                className="bg-primary text-white hover:bg-accent text-xs"
                onClick={() => payAllMutation.mutate()}
                disabled={payAllMutation.isPending}
              >
                {payAllMutation.isPending ? "Processing..." : `Pay all ($${totalPending.toFixed(2)})`}
              </Button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase">
                  <th className="px-4 py-2">Affiliate</th>
                  <th className="px-4 py-2">Orders</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(pendingByAffiliate).map(([affId, group]) => (
                  <tr key={affId} className="border-b border-border hover:bg-secondary">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{group.name}</p>
                      <p className="text-xs text-muted-foreground">{group.email}</p>
                    </td>
                    <td className="px-4 py-3 text-foreground">{group.count}</td>
                    <td className="px-4 py-3 font-semibold text-foreground">${group.total.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => { setSelectedAffiliate(affId); setShowPayDialog(true); }}
                      >
                        <Check className="h-3 w-3 mr-1" /> Mark paid
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* All payout transactions */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Payout transactions</h2>
            <div className="flex gap-1">
              {["all", "pending", "paid"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    filter === f ? "bg-primary text-white" : "bg-secondary text-muted-foreground hover:bg-[#e1e3e5]"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !earnings?.length ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-[#c9cccf] mx-auto mb-3" />
              <h3 className="font-semibold text-foreground">No payout transactions</h3>
              <p className="text-sm text-muted-foreground mt-1">When affiliate codes are used on orders, earnings will appear here.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase">
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Affiliate</th>
                  <th className="px-4 py-2">Order</th>
                  <th className="px-4 py-2">Order Total</th>
                  <th className="px-4 py-2">Rate</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2 text-right">Commission</th>
                </tr>
              </thead>
              <tbody>
                {earnings.map((e) => (
                  <tr key={e.id} className="border-b border-border hover:bg-secondary">
                    <td className="px-4 py-2.5 text-foreground">
                      {format(new Date(e.created_at), "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-2.5">
                      <p className="text-foreground">{(e as any).affiliates?.name || "—"}</p>
                      <p className="text-xs text-muted-foreground">{(e as any).affiliates?.discount_code}</p>
                    </td>
                    <td className="px-4 py-2.5 text-blue-400">{e.order_number || "—"}</td>
                    <td className="px-4 py-2.5 text-foreground">${Number(e.order_total).toFixed(2)}</td>
                    <td className="px-4 py-2.5">
                      <Badge className="bg-blue-900/30 text-blue-400">{e.commission_rate}%</Badge>
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge className={e.status === "paid" ? "bg-green-900/30 text-green-400" : "bg-yellow-900/30 text-yellow-400"}>
                        {e.status === "paid" ? "Paid" : "Pending"}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold text-foreground">
                      ${Number(e.commission_amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Confirm pay dialog */}
      <Dialog open={showPayDialog} onOpenChange={setShowPayDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Payout</DialogTitle>
          </DialogHeader>
          {selectedAffiliate && pendingByAffiliate[selectedAffiliate] && (
            <div className="space-y-4 mt-2">
              <div className="bg-secondary rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Paying</p>
                <p className="text-lg font-semibold text-foreground">{pendingByAffiliate[selectedAffiliate].name}</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  ${pendingByAffiliate[selectedAffiliate].total.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {pendingByAffiliate[selectedAffiliate].count} order{pendingByAffiliate[selectedAffiliate].count !== 1 ? "s" : ""}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                This will mark all pending commissions for this affiliate as paid. Make sure you've sent the payment externally first.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowPayDialog(false)}>Cancel</Button>
                <Button
                  className="bg-primary text-white hover:bg-accent"
                  onClick={() => payoutMutation.mutate(selectedAffiliate)}
                  disabled={payoutMutation.isPending}
                >
                  {payoutMutation.isPending ? "Processing..." : "Confirm paid"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default FinancePayouts;
