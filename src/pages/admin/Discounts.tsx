import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Tag,
  Package,
  Truck,
  Percent,
  Users,
  Loader2,
} from "lucide-react";

const Discounts = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data: discounts, isLoading } = useQuery({
    queryKey: ["admin-discounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discounts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = discounts?.filter(
    (d) =>
      d.code.toLowerCase().includes(search.toLowerCase()) ||
      (d.description && d.description.toLowerCase().includes(search.toLowerCase()))
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "free_shipping":
        return <Truck className="h-4 w-4" />;
      case "percentage":
        return <Percent className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (d: any) => {
    if (d.discount_type === "free_shipping") return "Free shipping";
    if (d.applies_to === "product") return "Amount off product";
    return "Amount off order";
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-foreground" />
            <h1 className="text-xl font-semibold text-foreground">Discounts</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="text-sm border-border text-foreground"
              onClick={() => navigate("/admin/affiliates")}
            >
              <Users className="h-4 w-4 mr-2" />
              Affiliates
            </Button>
            <Button
              className="bg-primary text-white hover:bg-accent text-sm"
              onClick={() => navigate("/admin/discounts/new")}
            >
              Create discount
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <span className="text-sm text-muted-foreground">All</span>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search and filter"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 border-border bg-secondary h-9 text-sm"
              />
            </div>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !filtered?.length ? (
            <div className="text-center py-12 text-muted-foreground">
              No discounts found. Create your first discount code.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground uppercase">
                  <th className="px-4 py-3 w-8">
                    <Checkbox />
                  </th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3 text-right">Used</th>
                </tr>
              </thead>
              <tbody>
                {filtered?.map((discount) => (
                  <tr
                    key={discount.id}
                    className="border-b border-border hover:bg-secondary cursor-pointer"
                    onClick={() => navigate(`/admin/discounts/${discount.id}`)}
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox />
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-foreground">
                            {discount.code}
                          </span>
                          {discount.is_affiliate && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              Affiliate
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {discount.discount_type === "percentage"
                            ? `${discount.discount_value}% off`
                            : discount.discount_type === "fixed_amount"
                            ? `$${discount.discount_value} off`
                            : "Free shipping"}
                          {discount.description && ` • ${discount.description}`}
                          {discount.max_uses_per_customer === 1 &&
                            " • One use per customer"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={
                          discount.is_active
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                        }
                      >
                        {discount.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {discount.method === "code" ? "Code" : "Automatic"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        {getTypeIcon(discount.discount_type)}
                        {getTypeLabel(discount)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-foreground">
                      {discount.usage_count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Discounts;
