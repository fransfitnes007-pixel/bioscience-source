import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { FileText } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

const reportTypes = [
  { id: "sessions-location", label: "Sessions by location", metric: "Sessions" },
  { id: "sessions-referrer", label: "Sessions by referrer", metric: "Sessions" },
  { id: "sessions-device", label: "Sessions by device type", metric: "Sessions" },
  { id: "sales-product", label: "Sales by product", metric: "Sales" },
  { id: "top-landing", label: "Top landing pages", metric: "Sessions" },
];

const AnalyticsReports = () => {
  const [selectedReport, setSelectedReport] = useState("sessions-location");
  const [dateRange, setDateRange] = useState("today");

  const getDateRange = () => {
    const now = new Date();
    switch (dateRange) {
      case "today": return { start: startOfDay(now), end: endOfDay(now) };
      case "7d": return { start: startOfDay(subDays(now, 7)), end: endOfDay(now) };
      case "30d": return { start: startOfDay(subDays(now, 30)), end: endOfDay(now) };
      default: return { start: startOfDay(now), end: endOfDay(now) };
    }
  };

  const { start, end } = getDateRange();

  const { data: sessions = [] } = useQuery({
    queryKey: ["report-sessions", dateRange],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_sessions")
        .select("*")
        .gte("started_at", start.toISOString())
        .lte("started_at", end.toISOString());
      return data || [];
    },
  });

  const reportData = (() => {
    switch (selectedReport) {
      case "sessions-location": {
        const locs: Record<string, number> = {};
        sessions.forEach(s => {
          const loc = [s.country, s.city].filter(Boolean).join(" · ") || "Unknown";
          locs[loc] = (locs[loc] || 0) + 1;
        });
        return Object.entries(locs).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));
      }
      case "sessions-referrer": {
        const refs: Record<string, number> = { Direct: 0 };
        sessions.forEach(s => {
          if (!s.referrer) { refs["Direct"]++; return; }
          const r = s.referrer.toLowerCase();
          let source = "Other";
          if (r.includes("google")) source = "Google";
          else if (r.includes("bing")) source = "Bing";
          else if (r.includes("yahoo")) source = "Yahoo";
          else if (r.includes("duckduckgo")) source = "DuckDuckGo";
          else if (r.includes("tiktok")) source = "TikTok";
          else if (r.includes("instagram")) source = "Instagram";
          else if (r.includes("facebook")) source = "Facebook";
          else if (r.includes("youtube")) source = "YouTube";
          else if (r.includes("twitter") || r.includes("x.com")) source = "X (Twitter)";
          else if (r.includes("reddit")) source = "Reddit";
          refs[source] = (refs[source] || 0) + 1;
        });
        return Object.entries(refs).filter(([,v]) => v > 0).sort((a,b) => b[1]-a[1]).map(([name,value]) => ({name,value}));
      }
      case "sessions-device": {
        const devs: Record<string, number> = {};
        sessions.forEach(s => {
          const t = s.device_type || "Desktop";
          devs[t] = (devs[t] || 0) + 1;
        });
        return Object.entries(devs).sort((a,b) => b[1]-a[1]).map(([name,value]) => ({name,value}));
      }
      case "top-landing": {
        const pages: Record<string, number> = {};
        sessions.forEach(s => {
          const p = s.first_page || "/";
          pages[p] = (pages[p] || 0) + 1;
        });
        return Object.entries(pages).sort((a,b) => b[1]-a[1]).slice(0,10).map(([name,value]) => ({name,value}));
      }
      default:
        return [];
    }
  })();

  const report = reportTypes.find(r => r.id === selectedReport)!;
  const totalValue = reportData.reduce((sum, d) => sum + d.value, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <h1 className="text-xl font-semibold">Reports</h1>
          </div>
          <div className="flex gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[130px] h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
          {/* Report list */}
          <Card>
            <CardContent className="p-2 space-y-0.5">
              {reportTypes.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedReport(r.id)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    selectedReport === r.id ? "bg-accent text-accent-foreground" : "hover:bg-muted text-foreground"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Report detail */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">{report.label}</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-primary">{totalValue} {report.metric}</span>
                </div>
              </CardHeader>
              <CardContent>
                {reportData.length > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={reportData} layout="vertical" margin={{ left: 120 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={110} />
                        <Tooltip />
                        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-12">No data for this date range</p>
                )}
              </CardContent>
            </Card>

            {/* Data table */}
            <Card>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">{report.metric}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border bg-muted/30">
                      <td className="px-4 py-2 font-medium">Summary</td>
                      <td className="px-4 py-2 text-right font-medium">{totalValue}</td>
                    </tr>
                    {reportData.map((d) => (
                      <tr key={d.name} className="border-b border-border">
                        <td className="px-4 py-2">{d.name}</td>
                        <td className="px-4 py-2 text-right">{d.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsReports;
