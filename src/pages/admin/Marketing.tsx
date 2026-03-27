import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Megaphone } from "lucide-react";

const Marketing = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ sessions: 0, sales: 0, orders: 0 });

  useEffect(() => {
    const fetch = async () => {
      const { data: sessions } = await supabase.from("user_sessions").select("id", { count: "exact", head: true });
      const { data: orders } = await supabase.from("orders").select("total");
      const totalSales = orders?.reduce((s: number, o: any) => s + (Number(o.total) || 0), 0) || 0;
      setStats({
        sessions: sessions ? (sessions as any).length || 0 : 0,
        sales: totalSales,
        orders: orders?.length || 0,
      });
    };
    fetch();
  }, []);

  const channels = [
    { name: "Google Search", type: "organic", sessions: 21, sales: "$0.00", orders: 0, conversion: "0%" },
    { name: "Direct", type: "direct", sessions: 19, sales: "$0.00", orders: 0, conversion: "0%" },
    { name: "Bing", type: "organic", sessions: 1, sales: "$0.00", orders: 0, conversion: "0%" },
    { name: "Instagram", type: "organic", sessions: 1, sales: "$0.00", orders: 0, conversion: "0%" },
    { name: "TikTok", type: "organic", sessions: 0, sales: "$0.00", orders: 0, conversion: "0%" },
    { name: "Yahoo", type: "organic", sessions: 0, sales: "$0.00", orders: 0, conversion: "0%" },
    { name: "DuckDuckGo", type: "organic", sessions: 0, sales: "$0.00", orders: 0, conversion: "0%" },
    { name: "Baidu", type: "organic", sessions: 0, sales: "$0.00", orders: 0, conversion: "0%" },
    { name: "Yandex", type: "organic", sessions: 0, sales: "$0.00", orders: 0, conversion: "0%" },
    { name: "Ecosia", type: "organic", sessions: 0, sales: "$0.00", orders: 0, conversion: "0%" },
    { name: "Facebook", type: "organic", sessions: 0, sales: "$0.00", orders: 0, conversion: "0%" },
    { name: "YouTube", type: "organic", sessions: 0, sales: "$0.00", orders: 0, conversion: "0%" },
    { name: "Pinterest", type: "organic", sessions: 0, sales: "$0.00", orders: 0, conversion: "0%" },
    { name: "X (Twitter)", type: "organic", sessions: 0, sales: "$0.00", orders: 0, conversion: "0%" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-[#202223]" />
            <h1 className="text-xl font-semibold text-[#202223]">Marketing</h1>
          </div>
        </div>

        {/* Date range */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg border border-[#c9cccf] text-sm text-[#202223] bg-white">📅 Last 30 days</span>
          <span className="px-3 py-1.5 rounded-lg border border-[#c9cccf] text-sm text-[#6d7175] bg-white">No comparison</span>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl border border-[#e1e3e5] overflow-hidden">
          <div className="flex divide-x divide-[#e1e3e5]">
            <div className="flex-1 px-5 py-4">
              <p className="text-sm text-[#6d7175]">Sessions</p>
              <p className="text-lg font-semibold text-[#202223]">{stats.sessions}</p>
            </div>
            <div className="flex-1 px-5 py-4">
              <p className="text-sm text-[#6d7175]">Sales attributed to marketing</p>
              <p className="text-lg font-semibold text-[#202223]">${stats.sales.toFixed(2)}</p>
            </div>
            <div className="flex-1 px-5 py-4">
              <p className="text-sm text-[#6d7175]">Orders attributed to marketing</p>
              <p className="text-lg font-semibold text-[#202223]">{stats.orders}</p>
            </div>
            <div className="flex-1 px-5 py-4">
              <p className="text-sm text-[#6d7175]">Conversion rate</p>
              <p className="text-lg font-semibold text-[#202223]">0%</p>
            </div>
          </div>
        </div>

        {/* Top marketing channels */}
        <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-[#202223]">Top marketing channels</h2>
            <a href="#" className="text-sm text-[#005bd3] hover:underline">View report</a>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e1e3e5] text-left">
                <th className="py-2 text-[#6d7175] font-medium">Channel</th>
                <th className="py-2 text-[#6d7175] font-medium">Type</th>
                <th className="py-2 text-[#6d7175] font-medium text-right">Sessions</th>
                <th className="py-2 text-[#6d7175] font-medium text-right">Sales</th>
                <th className="py-2 text-[#6d7175] font-medium text-right">Orders</th>
                <th className="py-2 text-[#6d7175] font-medium text-right">Conversion rate</th>
                <th className="py-2 text-[#6d7175] font-medium text-right">ROAS</th>
                <th className="py-2 text-[#6d7175] font-medium text-right">CPA</th>
                <th className="py-2 text-[#6d7175] font-medium text-right">CTR</th>
              </tr>
            </thead>
            <tbody>
              {channels.map((ch, i) => (
                <tr key={i} className="border-b border-[#e1e3e5]">
                  <td className="py-3 text-[#202223] font-medium">{ch.name}</td>
                  <td className="py-3 text-[#6d7175]">{ch.type}</td>
                  <td className="py-3 text-[#202223] text-right">{ch.sessions}</td>
                  <td className="py-3 text-[#202223] text-right">{ch.sales}</td>
                  <td className="py-3 text-[#202223] text-right">{ch.orders}</td>
                  <td className="py-3 text-[#202223] text-right">{ch.conversion}</td>
                  <td className="py-3 text-[#6d7175] text-right">—</td>
                  <td className="py-3 text-[#6d7175] text-right">—</td>
                  <td className="py-3 text-[#6d7175] text-right">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Campaign tracking CTA */}
        <div className="bg-white rounded-xl border border-[#e1e3e5] p-8 flex items-center justify-between">
          <div className="max-w-lg">
            <h2 className="font-semibold text-[#202223] text-lg mb-2">Centralize your campaign tracking</h2>
            <p className="text-sm text-[#6d7175] mb-4">
              Create campaigns to evaluate how marketing initiatives drive business goals. Capture online and offline touchpoints,
              add campaign activities from multiple marketing channels, and monitor results.
            </p>
            <Button size="sm" className="bg-[#303030] text-white hover:bg-[#1a1a1a]" onClick={() => navigate("/admin/marketing/campaigns")}>
              Create campaign
            </Button>
          </div>
          <div className="w-32 h-32 bg-gradient-to-br from-[#4285f4] to-[#1a73e8] rounded-2xl flex items-center justify-center">
            <Megaphone className="h-12 w-12 text-white" />
          </div>
        </div>

        {/* Marketing app activities */}
        <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-[#202223]">Marketing app activities</h2>
            <a href="#" className="text-sm text-[#005bd3] hover:underline">Explore apps</a>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e1e3e5] text-left">
                <th className="py-2 text-[#6d7175] font-medium">App</th>
                <th className="py-2 text-[#6d7175] font-medium">Activities in progress</th>
                <th className="py-2 text-[#6d7175] font-medium">Last activity</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#e1e3e5]">
                <td className="py-3 text-[#202223]">Messaging</td>
                <td className="py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Sending (1)</span>
                </td>
                <td className="py-3 text-[#6d7175]">Nov 9, 2024</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-center text-sm text-[#6d7175]">
          Learn more about <a href="#" className="text-[#005bd3] hover:underline">marketing campaigns</a>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Marketing;
