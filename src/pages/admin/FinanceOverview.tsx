import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { DollarSign, CreditCard, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const FinanceOverview = () => {
  const navigate = useNavigate();

  const { data: earnings, isLoading } = useQuery({
    queryKey: ["finance-overview"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("affiliate_earnings")
        .select("*, affiliates(name)")
        .order("created_at", { ascending: false })
        .limit(15);
      if (error) throw error;
      return data;
    },
  });

  const { data: orders } = useQuery({
    queryKey: ["finance-orders-summary"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("total, payment_status, created_at")
        .eq("payment_status", "paid")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
  });

  const totalRevenue = orders?.reduce((s, o) => s + Number(o.total), 0) || 0;
  const pendingPayouts = earnings?.filter(e => e.status === "pending").reduce((s, e) => s + Number(e.commission_amount), 0) || 0;
  const totalPaidOut = earnings?.filter(e => e.status === "paid").reduce((s, e) => s + Number(e.commission_amount), 0) || 0;

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <DollarSign className="h-5 w-5 text-foreground" />
          <h1 className="text-xl font-semibold text-foreground">Finance</h1>
        </div>

        {/* Accounts & Payout Balance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left column */}
          <div className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-5">
              <h2 className="text-base font-semibold text-foreground mb-3">Accounts</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-secondary cursor-pointer" onClick={() => navigate("/admin/finance/payouts")}>
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Payouts</span>
                  </div>
                  <Badge className="bg-green-900/30 text-green-400 text-xs">Active</Badge>
                </div>
                <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-secondary">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Credit</span>
                  </div>
                  <span className="text-sm text-foreground">$0.00</span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-foreground">Affiliate Payouts</h2>
                <button onClick={() => navigate("/admin/finance/payouts")} className="text-sm text-blue-400 hover:underline flex items-center gap-1">
                  Manage <ArrowRight className="h-3 w-3" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Pending payouts</p>
                  <p className="text-lg font-semibold text-foreground">${pendingPayouts.toFixed(2)}</p>
                </div>
                <div className="bg-secondary rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Total paid out</p>
                  <p className="text-lg font-semibold text-foreground">${totalPaidOut.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Recent transactions */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-foreground">Payout balance</h2>
                <p className="text-2xl font-semibold text-foreground">${pendingPayouts.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">🇺🇸 USD</p>
                <p className="text-sm text-foreground">${totalRevenue.toFixed(2)}</p>
                <button onClick={() => navigate("/admin/finance/payouts")} className="text-sm text-blue-400 hover:underline mt-1">View payouts</button>
              </div>
            </div>

            <div className="px-5 py-3 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Recent transactions</h3>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : !earnings?.length ? (
              <div className="text-center py-8 text-sm text-muted-foreground">No transactions yet</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="px-5 py-2">Date</th>
                    <th className="px-5 py-2">Status</th>
                    <th className="px-5 py-2">Description</th>
                    <th className="px-5 py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {earnings.map((e) => (
                    <tr key={e.id} className="border-b border-border hover:bg-secondary">
                      <td className="px-5 py-2.5 text-foreground">{format(new Date(e.created_at), "MMM d, yyyy")}</td>
                      <td className="px-5 py-2.5">
                        <Badge className={e.status === "paid" ? "bg-green-900/30 text-green-400" : "bg-yellow-900/30 text-yellow-400"}>
                          {e.status === "paid" ? "Paid" : "Pending"}
                        </Badge>
                      </td>
                      <td className="px-5 py-2.5 text-muted-foreground">
                        {(e as any).affiliates?.name || "Affiliate"} — {e.order_number || "Order"}
                      </td>
                      <td className="px-5 py-2.5 text-right font-medium text-foreground">
                        -${Number(e.commission_amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default FinanceOverview;
