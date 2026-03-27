import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, Star, MessageSquare, Settings, Megaphone, Bookmark } from "lucide-react";
import {
  LineChart, Line, ResponsiveContainer
} from "recharts";

const ShopChannel = () => {
  const { data: orders = [] } = useQuery({
    queryKey: ["shop-orders-today"],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { data } = await supabase
        .from("orders")
        .select("id, total")
        .gte("created_at", today.toISOString());
      return data || [];
    },
  });

  const todaySales = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const { data: siteSettings } = useQuery({
    queryKey: ["shop-settings"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .in("key", ["shop_followers", "shop_description"]);
      const map: Record<string, string> = {};
      data?.forEach(s => { map[s.key] = s.value || ""; });
      return map;
    },
  });

  const followers = parseInt(siteSettings?.shop_followers || "0");

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-5 w-5 text-muted-foreground" />
            <h1 className="text-xl font-semibold">Shop</h1>
          </div>
        </div>

        {/* Status banner */}
        <Card className="border-amber-500/30 bg-amber-50/5">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium">Your store is ready to sell on Shop</p>
                  <Badge className="bg-green-600 text-white">Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Customers can discover and purchase your products through the Shop app and website.
                </p>
              </div>
              <Button variant="outline" size="sm">Review settings</Button>
            </div>
          </CardContent>
        </Card>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="flex items-center gap-2">
            <CardContent className="pt-4 pb-4 w-full">
              <p className="text-xs text-muted-foreground mb-1">Today</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-sm text-muted-foreground">Shop total sales</p>
              <p className="text-xl font-semibold">${todaySales.toFixed(2)}</p>
              <div className="h-6 mt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[{ v: 0 }, { v: todaySales }]}>
                    <Line type="monotone" dataKey="v" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-sm text-muted-foreground">Shop orders</p>
              <p className="text-xl font-semibold">{orders.length}</p>
              <div className="h-6 mt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[{ v: 0 }, { v: orders.length }]}>
                    <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-sm text-muted-foreground">Store total sales</p>
              <p className="text-xl font-semibold">${todaySales.toFixed(2)}</p>
              <div className="h-6 mt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[{ v: 0 }, { v: todaySales }]}>
                    <Line type="monotone" dataKey="v" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-sm text-muted-foreground">Store orders</p>
              <p className="text-xl font-semibold">{orders.length}</p>
              <div className="h-6 mt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[{ v: 0 }, { v: orders.length }]}>
                    <Line type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Store Profile */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-base font-medium">Store</CardTitle>
                <Badge variant="outline" className="text-green-600 border-green-600">Active</Badge>
                <span className="text-sm text-muted-foreground">{followers} followers</span>
              </div>
              <Button variant="outline" size="sm">Customize</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6">
              {/* Phone mockup */}
              <div className="w-[200px] h-[360px] bg-[#1a1a1a] rounded-[24px] border-4 border-[#333] overflow-hidden flex flex-col">
                <div className="h-8 bg-[#1a1a1a] flex items-center justify-center">
                  <div className="w-12 h-1.5 bg-[#333] rounded-full" />
                </div>
                <div className="flex-1 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] flex flex-col items-center justify-center gap-3 px-4">
                  <div className="w-12 h-12 rounded-full bg-[#333] flex items-center justify-center">
                    <span className="text-white text-xs font-bold">RES</span>
                  </div>
                  <p className="text-white text-sm font-semibold tracking-wider">RESURRECTED</p>
                  <Button variant="outline" size="sm" className="text-xs h-6 border-[#444] text-[#999]">Follow</Button>
                </div>
              </div>
              {/* Store details */}
              <div className="flex-1 space-y-4">
                <div>
                  <p className="font-medium">Resurrected</p>
                  <p className="text-sm text-primary cursor-pointer hover:underline">Add description and contact information</p>
                </div>
                <Button variant="outline" size="sm">Edit details</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sub pages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-muted rounded-lg">
                  <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Catalog</p>
                  <p className="text-sm text-muted-foreground">Manage products shown in Shop</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-muted rounded-lg">
                  <Star className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Reviews</p>
                  <p className="text-sm text-muted-foreground">View and manage customer reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-muted rounded-lg">
                  <Bookmark className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Promise</p>
                  <p className="text-sm text-muted-foreground">Delivery & return commitments</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-muted rounded-lg">
                  <Megaphone className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Advertising</p>
                  <p className="text-sm text-muted-foreground">Promote products on Shop</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-muted rounded-lg">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Marketing tools</p>
                  <p className="text-sm text-muted-foreground">Campaigns & automations</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-muted rounded-lg">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Settings</p>
                  <p className="text-sm text-muted-foreground">Shop channel preferences</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ShopChannel;
