import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, Search, ChevronLeft, ChevronRight } from "lucide-react";

interface Customer {
  user_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  business_name: string | null;
  country: string | null;
  created_at: string;
  order_count: number;
  total_spent: number;
}

const PAGE_SIZE = 50;

const Customers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      // Get profiles
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      // Get order counts per user
      const { data: orders } = await supabase
        .from("orders")
        .select("user_id, total");

      const orderMap: Record<string, { count: number; spent: number }> = {};
      orders?.forEach((o: any) => {
        if (!orderMap[o.user_id]) orderMap[o.user_id] = { count: 0, spent: 0 };
        orderMap[o.user_id].count++;
        orderMap[o.user_id].spent += Number(o.total) || 0;
      });

      if (profiles) {
        setCustomers(
          profiles.map((p: any) => ({
            user_id: p.user_id,
            email: p.business_email,
            first_name: p.first_name,
            last_name: p.last_name,
            business_name: p.business_name,
            country: p.country || "United States",
            created_at: p.created_at,
            order_count: orderMap[p.user_id]?.count || 0,
            total_spent: orderMap[p.user_id]?.spent || 0,
          }))
        );
      }
      setIsLoading(false);
    };
    fetch();
  }, []);

  const filtered = customers.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const name = `${c.first_name || ""} ${c.last_name || ""}`.toLowerCase();
    return name.includes(q) || (c.email?.toLowerCase().includes(q) ?? false);
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-foreground" />
            <h1 className="text-xl font-semibold text-foreground">Customers</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-card border-border text-foreground hover:bg-secondary">Export</Button>
            <Button variant="outline" size="sm" className="bg-card border-border text-foreground hover:bg-secondary">Import</Button>
            <Button variant="outline" size="sm" className="bg-card border-border text-foreground hover:bg-secondary">More actions</Button>
            <Button size="sm" className="bg-primary text-white hover:bg-primary/90">Add customer</Button>
          </div>
        </div>

        {/* Stats */}
        <div className="text-sm text-muted-foreground">
          {customers.length} customers &nbsp;·&nbsp; 100% of your customer base
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search customers"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {isLoading ? (
            <div className="text-center py-16 text-muted-foreground">Loading customers...</div>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="py-3 px-4 w-10"><Checkbox /></th>
                    <th className="py-3 px-4 text-muted-foreground font-medium">Customer name</th>
                    <th className="py-3 px-4 text-muted-foreground font-medium">Email subscription</th>
                    <th className="py-3 px-4 text-muted-foreground font-medium">Location</th>
                    <th className="py-3 px-4 text-muted-foreground font-medium">Orders</th>
                    <th className="py-3 px-4 text-muted-foreground font-medium text-right">Amount spent</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((c) => (
                    <tr
                      key={c.user_id}
                      className="border-b border-border hover:bg-secondary cursor-pointer transition-colors"
                      onClick={() => navigate(`/admin/customers/${c.user_id}`)}
                    >
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}><Checkbox /></td>
                      <td className="py-3 px-4 text-foreground font-medium">
                        {c.first_name || c.last_name
                          ? `${c.first_name || ""} ${c.last_name || ""}`.trim()
                          : c.email || "Unknown"}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Subscribed
                        </span>
                      </td>
                      <td className="py-3 px-4 text-foreground">{c.country}</td>
                      <td className="py-3 px-4 text-foreground">{c.order_count} orders</td>
                      <td className="py-3 px-4 text-foreground text-right">${c.total_spent.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="p-1 rounded hover:bg-secondary disabled:opacity-30">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} className="p-1 rounded hover:bg-secondary disabled:opacity-30">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Customers;
