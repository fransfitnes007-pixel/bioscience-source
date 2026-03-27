import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, TrendingUp, TrendingDown, Info } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

const COLORS = ["#36a2eb", "#7c3aed", "#f59e0b", "#10b981", "#ef4444", "#ec4899"];

const Analytics = () => {
  const [dateRange, setDateRange] = useState("today");

  const getDateRange = () => {
    const now = new Date();
    switch (dateRange) {
      case "today": return { start: startOfDay(now), end: endOfDay(now) };
      case "7d": return { start: startOfDay(subDays(now, 7)), end: endOfDay(now) };
      case "30d": return { start: startOfDay(subDays(now, 30)), end: endOfDay(now) };
      case "90d": return { start: startOfDay(subDays(now, 90)), end: endOfDay(now) };
      default: return { start: startOfDay(now), end: endOfDay(now) };
    }
  };

  const { start, end } = getDateRange();

  // Fetch orders for sales data
  const { data: orders = [] } = useQuery({
    queryKey: ["analytics-orders", dateRange],
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString())
        .order("created_at");
      return data || [];
    },
  });

  // Fetch sessions
  const { data: sessions = [] } = useQuery({
    queryKey: ["analytics-sessions", dateRange],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_sessions")
        .select("*")
        .gte("started_at", start.toISOString())
        .lte("started_at", end.toISOString());
      return data || [];
    },
  });

  // Fetch page views
  const { data: pageViews = [] } = useQuery({
    queryKey: ["analytics-pageviews", dateRange],
    queryFn: async () => {
      const { data } = await supabase
        .from("page_views")
        .select("*")
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString());
      return data || [];
    },
  });

  // Calculate metrics
  const grossSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const discountsTotal = orders.reduce((sum, o) => sum + (o.discount_amount || 0), 0);
  const shippingTotal = orders.reduce((sum, o) => sum + (o.shipping_cost || 0), 0);
  const taxTotal = orders.reduce((sum, o) => sum + (o.tax_amount || 0), 0);
  const netSales = grossSales - discountsTotal;
  const totalSales = netSales + shippingTotal + taxTotal;
  const avgOrderValue = orders.length > 0 ? grossSales / orders.length : 0;
  const totalSessions = sessions.length;

  // Sales over time chart data
  const salesOverTime = (() => {
    const hourly = dateRange === "today";
    const buckets: Record<string, number> = {};
    if (hourly) {
      for (let h = 0; h < 24; h++) {
        buckets[`${h}:00`] = 0;
      }
      orders.forEach((o) => {
        const hour = new Date(o.created_at).getHours();
        buckets[`${hour}:00`] += o.total || 0;
      });
    } else {
      const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90;
      for (let i = days; i >= 0; i--) {
        const d = format(subDays(new Date(), i), "MMM dd");
        buckets[d] = 0;
      }
      orders.forEach((o) => {
        const d = format(new Date(o.created_at), "MMM dd");
        if (buckets[d] !== undefined) buckets[d] += o.total || 0;
      });
    }
    return Object.entries(buckets).map(([time, value]) => ({ time, value }));
  })();

  // Sessions over time
  const sessionsOverTime = (() => {
    const hourly = dateRange === "today";
    const buckets: Record<string, number> = {};
    if (hourly) {
      for (let h = 0; h < 24; h++) buckets[`${h}:00`] = 0;
      sessions.forEach((s) => {
        const hour = new Date(s.started_at).getHours();
        buckets[`${hour}:00`] += 1;
      });
    } else {
      const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90;
      for (let i = days; i >= 0; i--) {
        const d = format(subDays(new Date(), i), "MMM dd");
        buckets[d] = 0;
      }
      sessions.forEach((s) => {
        const d = format(new Date(s.started_at), "MMM dd");
        if (buckets[d] !== undefined) buckets[d] += 1;
      });
    }
    return Object.entries(buckets).map(([time, value]) => ({ time, value }));
  })();

  // Device breakdown
  const deviceBreakdown = (() => {
    const counts: Record<string, number> = { Desktop: 0, Mobile: 0, Tablet: 0 };
    sessions.forEach((s) => {
      const type = s.device_type || "Desktop";
      counts[type] = (counts[type] || 0) + 1;
    });
    return Object.entries(counts).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value }));
  })();

  // Sessions by location
  const locationData = (() => {
    const locs: Record<string, number> = {};
    sessions.forEach((s) => {
      const loc = [s.country, s.city].filter(Boolean).join(" · ") || "Unknown";
      locs[loc] = (locs[loc] || 0) + 1;
    });
    return Object.entries(locs)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  })();

  // Referrer breakdown (social)
  const socialReferrers = (() => {
    const refs: Record<string, number> = {};
    sessions.forEach((s) => {
      if (!s.referrer) return;
      let source = "Other";
      const r = s.referrer.toLowerCase();
      if (r.includes("tiktok") || r.includes("tiktok.com")) source = "TikTok";
      else if (r.includes("instagram") || r.includes("instagram.com")) source = "Instagram";
      else if (r.includes("facebook") || r.includes("fb.com")) source = "Facebook";
      else if (r.includes("twitter") || r.includes("x.com")) source = "X (Twitter)";
      else if (r.includes("youtube")) source = "YouTube";
      else if (r.includes("pinterest")) source = "Pinterest";
      else if (r.includes("snapchat")) source = "Snapchat";
      else if (r.includes("linkedin")) source = "LinkedIn";
      else if (r.includes("reddit")) source = "Reddit";
      refs[source] = (refs[source] || 0) + 1;
    });
    return Object.entries(refs)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));
  })();

  // Sessions by referrer (search engines + direct + social)
  const referrerBreakdown = (() => {
    const refs: Record<string, number> = { Direct: 0 };
    sessions.forEach((s) => {
      if (!s.referrer) { refs["Direct"] += 1; return; }
      const r = s.referrer.toLowerCase();
      let source = "Other";
      if (r.includes("google")) source = "Google";
      else if (r.includes("bing")) source = "Bing";
      else if (r.includes("yahoo")) source = "Yahoo";
      else if (r.includes("duckduckgo")) source = "DuckDuckGo";
      else if (r.includes("baidu")) source = "Baidu";
      else if (r.includes("yandex")) source = "Yandex";
      else if (r.includes("ecosia")) source = "Ecosia";
      else if (r.includes("brave")) source = "Brave Search";
      else if (r.includes("tiktok")) source = "TikTok";
      else if (r.includes("instagram")) source = "Instagram";
      else if (r.includes("facebook") || r.includes("fb.com")) source = "Facebook";
      else if (r.includes("youtube")) source = "YouTube";
      else if (r.includes("twitter") || r.includes("x.com")) source = "X (Twitter)";
      else if (r.includes("pinterest")) source = "Pinterest";
      else if (r.includes("snapchat")) source = "Snapchat";
      else if (r.includes("reddit")) source = "Reddit";
      else if (r.includes("linkedin")) source = "LinkedIn";
      refs[source] = (refs[source] || 0) + 1;
    });
    return Object.entries(refs)
      .filter(([, v]) => v > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));
  })();

  // Sessions by landing page
  const landingPages = (() => {
    const pages: Record<string, number> = {};
    sessions.forEach((s) => {
      const page = s.first_page || "/";
      pages[page] = (pages[page] || 0) + 1;
    });
    return Object.entries(pages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  })();

  // Conversion funnel
  const cartAdds = pageViews.filter(pv => pv.page_path?.includes("/cart")).length;
  const checkoutViews = pageViews.filter(pv => pv.page_path?.includes("/checkout")).length;
  const completedOrders = orders.length;

  const conversionRate = totalSessions > 0 ? ((completedOrders / totalSessions) * 100).toFixed(1) : "0";

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            <h1 className="text-xl font-semibold">Analytics</h1>
            <span className="text-xs text-muted-foreground">Last refreshed: {format(new Date(), "h:mm a")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[140px] h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-sm text-muted-foreground">Gross sales</p>
              <p className="text-2xl font-semibold">${grossSales.toFixed(2)}</p>
              <div className="h-8 mt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesOverTime.slice(-12)}>
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-sm text-muted-foreground">Returning customer rate</p>
              <p className="text-2xl font-semibold">0%</p>
              <div className="h-8 mt-1">
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
              <p className="text-sm text-muted-foreground">Orders fulfilled</p>
              <p className="text-2xl font-semibold">{orders.filter(o => o.status === "delivered" || o.status === "shipped").length}</p>
              <div className="h-8 mt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesOverTime.slice(-12)}>
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-sm text-muted-foreground">Orders</p>
              <p className="text-2xl font-semibold">{orders.length}</p>
              <div className="h-8 mt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesOverTime.slice(-12)}>
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Total sales over time + Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Total sales over time</CardTitle>
              <p className="text-2xl font-semibold">${totalSales.toFixed(2)}</p>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${v}`} />
                    <Tooltip formatter={(v: number) => [`$${v.toFixed(2)}`, "Sales"]} />
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-base font-medium">Total sales breakdown</CardTitle>
              <Info className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Gross sales", value: grossSales, color: "text-primary" },
                { label: "Discounts", value: discountsTotal, color: "text-primary" },
                { label: "Returns", value: 0, color: "text-primary" },
                { label: "Net sales", value: netSales, color: "text-primary" },
                { label: "Shipping charges", value: shippingTotal, color: "text-primary" },
                { label: "Return fees", value: 0, color: "text-primary" },
                { label: "Taxes", value: taxTotal, color: "text-primary" },
                { label: "Total sales", value: totalSales, color: "text-primary font-medium" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-1 border-b border-border last:border-0">
                  <span className={`text-sm ${item.color}`}>{item.label}</span>
                  <span className="text-sm font-medium">${item.value.toFixed(2)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Row: Sales by channel, Avg order value, Sales by product */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Total sales by sales channel</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[160px]">
              {orders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No data for this date range</p>
              ) : (
                <p className="text-sm">Online Store: ${grossSales.toFixed(2)}</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Average order value over time</CardTitle>
              <p className="text-2xl font-semibold">${avgOrderValue.toFixed(2)}</p>
            </CardHeader>
            <CardContent>
              <div className="h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesOverTime}>
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${v}`} />
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Total sales by product</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[160px]">
              <p className="text-sm text-muted-foreground">No data for this date range</p>
            </CardContent>
          </Card>
        </div>

        {/* Sessions over time + Conversion rate + Conversion breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Sessions over time</CardTitle>
              <p className="text-2xl font-semibold">{totalSessions}</p>
            </CardHeader>
            <CardContent>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sessionsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Conversion rate over time</CardTitle>
              <p className="text-2xl font-semibold">{conversionRate}%</p>
            </CardHeader>
            <CardContent>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sessionsOverTime.map(s => ({ ...s, value: 0 }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `${v}%`} domain={[0, 100]} />
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Conversion rate breakdown</CardTitle>
              <p className="text-2xl font-semibold">{conversionRate}%</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2 text-center mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Sessions</p>
                  <p className="text-sm font-semibold">100%</p>
                  <p className="text-xs text-primary">{totalSessions}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Added to cart</p>
                  <p className="text-sm font-semibold">{totalSessions > 0 ? ((cartAdds / totalSessions) * 100).toFixed(0) : 0}%</p>
                  <p className="text-xs">{cartAdds}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Reached checkout</p>
                  <p className="text-sm font-semibold">{totalSessions > 0 ? ((checkoutViews / totalSessions) * 100).toFixed(0) : 0}%</p>
                  <p className="text-xs">{checkoutViews}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                  <p className="text-sm font-semibold">{conversionRate}%</p>
                  <p className="text-xs">{completedOrders}</p>
                </div>
              </div>
              <div className="h-[80px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: "Sessions", value: totalSessions },
                    { name: "Cart", value: cartAdds },
                    { name: "Checkout", value: checkoutViews },
                    { name: "Completed", value: completedOrders },
                  ]}>
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Device type + Location + Social referrer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Sessions by device type</CardTitle>
            </CardHeader>
            <CardContent>
              {deviceBreakdown.length > 0 ? (
                <div className="flex items-center gap-4">
                  <div className="h-[160px] w-[160px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {deviceBreakdown.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2">
                    {deviceBreakdown.map((d, i) => (
                      <div key={d.name} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span>{d.name}</span>
                        <span className="font-medium ml-auto">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No data for this date range</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Sessions by location</CardTitle>
            </CardHeader>
            <CardContent>
              {locationData.length > 0 ? (
                <div className="space-y-3">
                  {locationData.map((loc) => (
                    <div key={loc.name}>
                      <p className="text-sm mb-1">{loc.name}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full"
                            style={{ width: `${(loc.value / Math.max(...locationData.map(l => l.value))) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-6 text-right">{loc.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No data for this date range</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Total sales by social referrer</CardTitle>
            </CardHeader>
            <CardContent>
              {socialReferrers.length > 0 ? (
                <div className="space-y-2">
                  {socialReferrers.map((ref) => (
                    <div key={ref.name} className="flex items-center justify-between text-sm">
                      <span>{ref.name}</span>
                      <span className="font-medium">{ref.value} sessions</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No data for this date range</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sessions by referrer + Landing pages + Referring channel performance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Sessions by referrer</CardTitle>
            </CardHeader>
            <CardContent>
              {referrerBreakdown.length > 0 ? (
                <div className="space-y-3">
                  {referrerBreakdown.map((ref) => (
                    <div key={ref.name}>
                      <p className="text-sm mb-1">{ref.name}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full"
                            style={{ width: `${(ref.value / Math.max(...referrerBreakdown.map(r => r.value))) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-6 text-right">{ref.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No data for this date range</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Sessions by landing page</CardTitle>
            </CardHeader>
            <CardContent>
              {landingPages.length > 0 ? (
                <div className="space-y-2">
                  {landingPages.map((page) => (
                    <div key={page.name} className="flex items-center justify-between text-sm py-1 border-b border-border last:border-0">
                      <span className="truncate max-w-[200px]">{page.name}</span>
                      <span className="font-medium">{page.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No data for this date range</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Performance by referring channel</CardTitle>
            </CardHeader>
            <CardContent>
              {referrerBreakdown.length > 0 ? (
                <div className="space-y-2">
                  {referrerBreakdown.slice(0, 5).map((ref) => (
                    <div key={ref.name} className="flex items-center justify-between text-sm py-1 border-b border-border last:border-0">
                      <span>{ref.name}</span>
                      <span className="font-medium">{ref.value} sessions</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No data for this date range</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
