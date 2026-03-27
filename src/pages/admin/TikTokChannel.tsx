import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Music, ExternalLink, Link2, BarChart3, ShoppingBag, Video, Settings, Users } from "lucide-react";
import {
  LineChart, Line, ResponsiveContainer
} from "recharts";

const TikTokChannel = () => {
  const [tiktokHandle, setTiktokHandle] = useState("@resurrected");
  const [isConnected, setIsConnected] = useState(true);

  const { data: orders = [] } = useQuery({
    queryKey: ["tiktok-orders-today"],
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

  // Get sessions from TikTok referrer
  const { data: tiktokSessions = [] } = useQuery({
    queryKey: ["tiktok-sessions"],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { data } = await supabase
        .from("user_sessions")
        .select("*")
        .gte("started_at", today.toISOString())
        .ilike("referrer", "%tiktok%");
      return data || [];
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Music className="h-5 w-5 text-muted-foreground" />
            <h1 className="text-xl font-semibold">TikTok</h1>
            {isConnected ? (
              <Badge variant="outline" className="text-green-600 border-green-600">Connected</Badge>
            ) : (
              <Badge variant="outline" className="text-amber-600 border-amber-600">Not connected</Badge>
            )}
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ExternalLink className="h-3 w-3" />
            Open TikTok
          </Button>
        </div>

        {/* Connection status */}
        {!isConnected ? (
          <Card className="border-primary/30">
            <CardContent className="pt-6 text-center space-y-4">
              <Music className="h-12 w-12 mx-auto text-muted-foreground" />
              <h2 className="text-lg font-semibold">Connect your TikTok account</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Link your TikTok account to track performance, manage your TikTok Shop catalog, and run ads directly from your admin.
              </p>
              <Button onClick={() => setIsConnected(true)}>Connect TikTok</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Account info */}
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                    <Music className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{tiktokHandle}</p>
                    <p className="text-sm text-muted-foreground">TikTok Business Account</p>
                  </div>
                  <Button variant="outline" size="sm">Disconnect</Button>
                </div>
              </CardContent>
            </Card>

            {/* TikTok KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4 pb-4">
                  <p className="text-sm text-muted-foreground">TikTok sessions</p>
                  <p className="text-2xl font-semibold">{tiktokSessions.length}</p>
                  <div className="h-6 mt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[{ v: 0 }, { v: tiktokSessions.length }]}>
                        <Line type="monotone" dataKey="v" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-4">
                  <p className="text-sm text-muted-foreground">TikTok sales</p>
                  <p className="text-2xl font-semibold">$0.00</p>
                  <div className="h-6 mt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[{ v: 0 }, { v: 0 }]}>
                        <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-4">
                  <p className="text-sm text-muted-foreground">TikTok orders</p>
                  <p className="text-2xl font-semibold">0</p>
                  <div className="h-6 mt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[{ v: 0 }, { v: 0 }]}>
                        <Line type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-4">
                  <p className="text-sm text-muted-foreground">Conversion rate</p>
                  <p className="text-2xl font-semibold">0%</p>
                  <div className="h-6 mt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[{ v: 0 }, { v: 0 }]}>
                        <Line type="monotone" dataKey="v" stroke="#c084fc" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* TikTok Management Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-muted rounded-lg">
                      <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Product catalog</p>
                      <p className="text-sm text-muted-foreground">Sync products to TikTok Shop</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">0 products synced</p>
                </CardContent>
              </Card>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-muted rounded-lg">
                      <Video className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Content</p>
                      <p className="text-sm text-muted-foreground">Manage shoppable videos</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Create TikTok content</p>
                </CardContent>
              </Card>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-muted rounded-lg">
                      <BarChart3 className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Ads</p>
                      <p className="text-sm text-muted-foreground">Create and manage TikTok ads</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Run campaigns from here</p>
                </CardContent>
              </Card>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-muted rounded-lg">
                      <Users className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Audience</p>
                      <p className="text-sm text-muted-foreground">TikTok pixel & audience insights</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Track visitor behavior</p>
                </CardContent>
              </Card>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-muted rounded-lg">
                      <Link2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Link in bio</p>
                      <p className="text-sm text-muted-foreground">Drive traffic from your TikTok</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Set up your landing page</p>
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
                      <p className="text-sm text-muted-foreground">TikTok channel preferences</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Account & pixel settings</p>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default TikTokChannel;
