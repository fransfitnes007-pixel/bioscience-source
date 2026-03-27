import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Megaphone, Plus, QrCode, Settings } from "lucide-react";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [campaignName, setCampaignName] = useState("");
  const campaignId = "3a781c";

  const emptyCharts = [
    ["Sessions by channel", "Sales by channel"],
    ["Sessions by UTM parameters", "Sales by UTM parameters"],
    ["Orders from new vs. returning customers", "Sales by order"],
  ];

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Unsaved changes bar */}
        <div className="bg-[#1a1a1a] text-white rounded-xl px-4 py-2 flex items-center justify-between -mx-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            Unsaved changes
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-transparent border-[#555] text-white hover:bg-[#333]">Discard</Button>
            <Button size="sm" className="bg-white text-[#202223] hover:bg-[#f1f1f1]">Save</Button>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#6d7175]">
          <button onClick={() => navigate("/admin/marketing/campaigns")} className="hover:text-[#202223] flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            <Megaphone className="h-4 w-4" />
          </button>
          <span>›</span>
          <span className="text-[#202223] font-semibold">Create campaign</span>
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Draft</span>
        </div>

        {/* Date range */}
        <div className="flex items-center justify-between">
          <span className="px-3 py-1.5 rounded-lg border border-[#c9cccf] text-sm text-[#6d7175] bg-white">📅 Year to date</span>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg border border-[#c9cccf] text-sm text-[#6d7175] bg-white">Last non-direct click</span>
            <Settings className="h-4 w-4 text-[#6d7175]" />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Left - Charts */}
          <div className="col-span-8 space-y-4">
            {/* Stats */}
            <div className="bg-white rounded-xl border border-[#e1e3e5] overflow-hidden">
              <div className="flex divide-x divide-[#e1e3e5]">
                {["Sessions", "Sales", "Orders", "Average order value"].map((label) => (
                  <div key={label} className="flex-1 px-4 py-3">
                    <p className="text-sm text-[#6d7175]">{label}</p>
                    <p className="text-xs text-[#6d7175] mt-1">No data for this date range</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Empty chart cards */}
            {emptyCharts.map((pair, i) => (
              <div key={i} className="grid grid-cols-2 gap-4">
                {pair.map((title) => (
                  <div key={title} className="bg-white rounded-xl border border-[#e1e3e5] p-5 min-h-[200px] flex flex-col">
                    <p className="text-sm text-[#6d7175] mb-4">{title}</p>
                    <div className="flex-1 flex items-center justify-center">
                      <p className="text-sm text-[#b5b5b5]">No data for this date range</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Right */}
          <div className="col-span-4 space-y-4">
            <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 space-y-3">
              <input
                type="text"
                placeholder="Campaign name"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[#c9cccf] text-sm text-[#202223] placeholder:text-[#6d7175] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
              />
              <div>
                <p className="text-xs text-[#6d7175]">ID</p>
                <p className="text-sm text-[#202223] font-mono">{campaignId}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-[#202223]">Shareable links</h2>
                <Plus className="h-4 w-4 text-[#6d7175]" />
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-[#e1e3e5]">
                <QrCode className="h-8 w-8 text-[#6d7175] shrink-0" />
                <div>
                  <p className="text-sm text-[#202223] font-mono">/s/{campaignId}</p>
                  <p className="text-xs text-[#6d7175]">/?utm_campaign={campaignId}&utm_s...</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-[#202223]">Auto-match rules</h2>
                <Plus className="h-4 w-4 text-[#6d7175]" />
              </div>
              <p className="text-sm text-[#6d7175]">Create rules to automatically assign traffic</p>
            </div>

            <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-[#202223]">Campaign activities</h2>
                <Plus className="h-4 w-4 text-[#6d7175]" />
              </div>
              <p className="text-sm text-[#6d7175]">Manually assign existing marketing traffic</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateCampaign;
