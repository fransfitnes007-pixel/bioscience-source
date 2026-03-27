import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Users, Pencil, Copy } from "lucide-react";
import { format } from "date-fns";

interface CustomerData {
  user_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  business_name: string | null;
  country: string | null;
  phone: string | null;
  created_at: string;
  order_count: number;
  total_spent: number;
}

const CustomerDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId!)
        .single();

      const { data: orders } = await supabase
        .from("orders")
        .select("total")
        .eq("user_id", userId!);

      if (profile) {
        setCustomer({
          user_id: profile.user_id,
          email: profile.business_email,
          first_name: profile.first_name,
          last_name: profile.last_name,
          business_name: profile.business_name,
          country: profile.country || "United States",
          phone: profile.phone,
          created_at: profile.created_at,
          order_count: orders?.length || 0,
          total_spent: orders?.reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0) || 0,
        });
      }
      setIsLoading(false);
    };
    fetch();
  }, [userId]);

  if (isLoading) {
    return <AdminLayout><div className="text-center py-20 text-[#6d7175]">Loading...</div></AdminLayout>;
  }
  if (!customer) {
    return <AdminLayout><div className="text-center py-20 text-[#6d7175]">Customer not found</div></AdminLayout>;
  }

  const displayName = customer.first_name || customer.last_name
    ? `${customer.first_name || ""} ${customer.last_name || ""}`.trim()
    : customer.email || "Unknown";

  const daysSince = Math.floor((Date.now() - new Date(customer.created_at).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-[#6d7175]">
            <button onClick={() => navigate("/admin/customers")} className="hover:text-[#202223] flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              <Users className="h-4 w-4" />
            </button>
            <span>›</span>
            <span className="text-[#202223] font-semibold">{displayName}</span>
          </div>
          <Button variant="outline" size="sm" className="bg-white border-[#c9cccf] text-[#202223] hover:bg-[#f6f6f7]">
            More actions
          </Button>
        </div>

        {/* Stats bar */}
        <div className="bg-white rounded-xl border border-[#e1e3e5] overflow-hidden">
          <div className="flex divide-x divide-[#e1e3e5]">
            <div className="flex-1 px-5 py-4">
              <p className="text-sm text-[#6d7175]">Amount spent</p>
              <p className="text-lg font-semibold text-[#202223]">${customer.total_spent.toFixed(2)}</p>
            </div>
            <div className="flex-1 px-5 py-4">
              <p className="text-sm text-[#6d7175]">Orders</p>
              <p className="text-lg font-semibold text-[#202223]">{customer.order_count}</p>
            </div>
            <div className="flex-1 px-5 py-4">
              <p className="text-sm text-[#6d7175]">Customer since</p>
              <p className="text-lg font-semibold text-[#202223]">{daysSince} days</p>
            </div>
            <div className="flex-1 px-5 py-4">
              <p className="text-sm text-[#6d7175]">RFM group</p>
              <p className="text-lg font-semibold text-[#202223]">—</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Left */}
          <div className="col-span-8 space-y-4">
            {/* Last order */}
            <div className="bg-white rounded-xl border border-[#e1e3e5] p-5">
              <h2 className="font-semibold text-[#202223] mb-2">Last order placed</h2>
              {customer.order_count === 0 ? (
                <div>
                  <p className="text-sm text-[#6d7175] mb-3">This customer hasn't placed any orders yet</p>
                  <Button variant="outline" size="sm" className="bg-white border-[#c9cccf] text-[#202223] hover:bg-[#f6f6f7]">
                    Create order
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-[#6d7175]">{customer.order_count} order(s) placed</p>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 space-y-4">
              <h2 className="font-semibold text-[#202223]">Timeline</h2>
              <div className="flex items-start gap-3 p-3 rounded-lg border border-[#e1e3e5]">
                <div className="w-8 h-8 rounded-full bg-[#50b83c] flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {(customer.first_name?.[0] || "C").toUpperCase()}
                </div>
                <input
                  type="text"
                  placeholder="Leave a comment..."
                  className="flex-1 text-sm text-[#202223] placeholder:text-[#6d7175] focus:outline-none"
                />
              </div>
              <p className="text-xs text-[#6d7175]">Only you and other staff can see comments</p>

              <div className="border-t border-[#e1e3e5] pt-4">
                <p className="text-xs text-[#6d7175] mb-2">{format(new Date(customer.created_at), "MMMM d")}</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#6d7175]" />
                  <p className="text-sm text-[#202223]">Online Store created this customer.</p>
                  <span className="text-xs text-[#6d7175] ml-auto">{format(new Date(customer.created_at), "h:mm a")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="col-span-4 space-y-4">
            <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 space-y-4">
              <h2 className="font-semibold text-[#202223]">Customer</h2>
              <div>
                <p className="text-xs text-[#6d7175] mb-1">Contact information</p>
                <div className="flex items-center justify-between">
                  <a href={`mailto:${customer.email}`} className="text-sm text-[#005bd3] hover:underline">{customer.email}</a>
                  <Copy className="h-3.5 w-3.5 text-[#6d7175] cursor-pointer hover:text-[#202223]" />
                </div>
                {customer.phone && <p className="text-sm text-[#202223] mt-1">{customer.phone}</p>}
              </div>
              <div>
                <p className="text-xs text-[#6d7175] mb-1">Default address</p>
                <p className="text-sm text-[#202223]">{customer.country}</p>
              </div>
              <div>
                <p className="text-xs text-[#6d7175] mb-1">Marketing</p>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-sm text-[#202223]">
                    <span className="w-2 h-2 rounded-full bg-[#50b83c]" /> Email
                  </span>
                  <span className="flex items-center gap-1 text-sm text-[#202223]">
                    <span className="w-2 h-2 rounded-full border border-[#c9cccf]" /> SMS
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-[#6d7175] mb-1">Tax details</p>
                <p className="text-sm text-[#202223]">Collect tax</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-[#202223]">Store credit</h2>
                <Pencil className="h-4 w-4 text-[#6d7175]" />
              </div>
              <p className="text-sm text-[#6d7175]">None</p>
            </div>

            <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-[#202223]">Tags</h2>
                <Pencil className="h-4 w-4 text-[#6d7175]" />
              </div>
              <input
                type="text"
                placeholder="Add tags..."
                className="w-full h-9 px-3 rounded-lg border border-[#c9cccf] text-sm text-[#202223] placeholder:text-[#6d7175] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
              />
            </div>

            <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-[#202223]">Notes</h2>
                <Pencil className="h-4 w-4 text-[#6d7175]" />
              </div>
              <p className="text-sm text-[#6d7175]">None</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CustomerDetail;
