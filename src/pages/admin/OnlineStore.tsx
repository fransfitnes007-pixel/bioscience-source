import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Globe, ExternalLink, Eye, Palette, Settings, FileText, Search, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const OnlineStore = () => {
  const { data: products = [] } = useQuery({
    queryKey: ["store-products-count"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("id, is_active");
      return data || [];
    },
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["store-orders-today"],
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

  const { data: sessions = [] } = useQuery({
    queryKey: ["store-sessions-today"],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { data } = await supabase
        .from("user_sessions")
        .select("id")
        .gte("started_at", today.toISOString());
      return data || [];
    },
  });

  const activeProducts = products.filter(p => p.is_active).length;
  const todaySales = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <h1 className="text-xl font-semibold">Online Store</h1>
            <Badge variant="outline" className="text-green-400 border-green-600">Active</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                View store
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>

        {/* Store Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-sm text-muted-foreground">Today's sales</p>
              <p className="text-2xl font-semibold">${todaySales.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-sm text-muted-foreground">Today's sessions</p>
              <p className="text-2xl font-semibold">{sessions.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-sm text-muted-foreground">Today's orders</p>
              <p className="text-2xl font-semibold">{orders.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-sm text-muted-foreground">Active products</p>
              <p className="text-2xl font-semibold">{activeProducts}</p>
            </CardContent>
          </Card>
        </div>

        {/* Theme / Customization */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">Themes</CardTitle>
              <Button variant="outline" size="sm">Customize</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 border border-border rounded-lg bg-muted/30">
              <div className="w-24 h-16 bg-gradient-to-br from-[#1a1a1a] to-[#333] rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold tracking-wider">RES</span>
              </div>
              <div className="flex-1">
                <p className="font-medium">Current theme</p>
                <p className="text-sm text-muted-foreground">Resurrected Custom Theme</p>
              </div>
              <Badge>Live</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Store management cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-muted rounded-lg">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Pages</p>
                  <p className="text-sm text-muted-foreground">Manage your store pages</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Home, Products, About, Terms, Privacy</p>
            </CardContent>
          </Card>

          <Link to="/admin/content/blog">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Blog posts</p>
                    <p className="text-sm text-muted-foreground">Manage blog content</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Create and publish articles</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/content/menus">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Navigation</p>
                    <p className="text-sm text-muted-foreground">Edit site menus</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Header and footer navigation</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Palette className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Preferences</p>
                  <p className="text-sm text-muted-foreground">SEO, social sharing, analytics</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Title, meta, favicon settings</p>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">SEO</p>
                  <p className="text-sm text-muted-foreground">Search engine optimization</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Sitemap, robots.txt, structured data</p>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Password protection</p>
                  <p className="text-sm text-muted-foreground">Restrict store access</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Currently disabled — store is public</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OnlineStore;
