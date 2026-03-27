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
          <DollarSign className="h-5 w-5 text-[#202223]" />
          <h1 className="text-xl font-semibold text-[#202223]">Finance</h1>
        </div>

        {/* Accounts & Payout Balance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left column */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-[#e1e3e5] p-5">
              <h2 className="text-base font-semibold text-[#202223] mb-3">Accounts</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-[#f6f6f7] cursor-pointer" onClick={() => navigate("/admin/finance/payouts")}>
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-[#6d7175]" />
                    <span className="text-sm text-[#202223]">Payouts</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
                </div>
                <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-[#f6f6f7]">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-[#6d7175]" />
                    <span className="text-sm text-[#202223]">Credit</span>
                  </div>
                  <span className="text-sm text-[#202223]">$0.00</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#e1e3e5] p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-[#202223]">Affiliate Payouts</h2>
                <button onClick={() => navigate("/admin/finance/payouts")} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  Manage <ArrowRight className="h-3 w-3" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#f6f6f7] rounded-lg p-3">
                  <p className="text-xs text-[#6d7175]">Pending payouts</p>
                  <p className="text-lg font-semibold text-[#202223]">${pendingPayouts.toFixed(2)}</p>
                </div>
                <div className="bg-[#f6f6f7] rounded-lg p-3">
                  <p className="text-xs text-[#6d7175]">Total paid out</p>
                  <p className="text-lg font-semibold text-[#202223]">${totalPaidOut.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Recent transactions */}
          <div className="bg-white rounded-xl border border-[#e1e3e5] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#e1e3e5] flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-[#202223]">Payout balance</h2>
                <p className="text-2xl font-semibold text-[#202223]">${pendingPayouts.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#6d7175]">🇺🇸 USD</p>
                <p className="text-sm text-[#202223]">${totalRevenue.toFixed(2)}</p>
                <button onClick={() => navigate("/admin/finance/payouts")} className="text-sm text-blue-600 hover:underline mt-1">View payouts</button>
              </div>
            </div>

            <div className="px-5 py-3 border-b border-[#e1e3e5]">
              <h3 className="text-sm font-semibold text-[#202223]">Recent transactions</h3>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-[#6d7175]" />
              </div>
            ) : !earnings?.length ? (
              <div className="text-center py-8 text-sm text-[#6d7175]">No transactions yet</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e1e3e5] text-left text-xs text-[#6d7175]">
                    <th className="px-5 py-2">Date</th>
                    <th className="px-5 py-2">Status</th>
                    <th className="px-5 py-2">Description</th>
                    <th className="px-5 py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {earnings.map((e) => (
                    <tr key={e.id} className="border-b border-[#e1e3e5] hover:bg-[#f6f6f7]">
                      <td className="px-5 py-2.5 text-[#202223]">{format(new Date(e.created_at), "MMM d, yyyy")}</td>
                      <td className="px-5 py-2.5">
                        <Badge className={e.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                          {e.status === "paid" ? "Paid" : "Pending"}
                        </Badge>
                      </td>
                      <td className="px-5 py-2.5 text-[#6d7175]">
                        {(e as any).affiliates?.name || "Affiliate"} — {e.order_number || "Order"}
                      </td>
                      <td className="px-5 py-2.5 text-right font-medium text-[#202223]">
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
