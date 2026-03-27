import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Megaphone } from "lucide-react";

const Campaigns = () => {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-[#202223]" />
            <h1 className="text-xl font-semibold text-[#202223]">Campaigns</h1>
          </div>
          <Button size="sm" className="bg-[#303030] text-white hover:bg-[#1a1a1a]" onClick={() => navigate("/admin/marketing/campaigns/new")}>
            Create campaign
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full border border-[#c9cccf] text-xs text-[#6d7175] bg-white">✨ 24 unassigned activities</span>
        </div>

        <div className="bg-white rounded-xl border border-[#e1e3e5] overflow-hidden">
          <div className="px-4 py-2 border-b border-[#e1e3e5]">
            <span className="text-sm text-[#6d7175]">All</span>
          </div>
          <div className="p-12 text-center flex items-center justify-between">
            <div className="max-w-lg text-left">
              <h2 className="font-semibold text-[#202223] text-lg mb-2">Centralize your campaign tracking</h2>
              <p className="text-sm text-[#6d7175] mb-4">
                Create campaigns to evaluate how marketing initiatives drive business goals. Capture online and offline touchpoints,
                add campaign activities from multiple marketing channels, and monitor results.
              </p>
              <div className="flex items-center gap-2">
                <Button size="sm" className="bg-[#303030] text-white hover:bg-[#1a1a1a]" onClick={() => navigate("/admin/marketing/campaigns/new")}>
                  Create campaign
                </Button>
                <Button variant="outline" size="sm" className="bg-white border-[#c9cccf] text-[#202223] hover:bg-[#f6f6f7]">
                  Learn more
                </Button>
              </div>
            </div>
            <div className="w-28 h-28 bg-gradient-to-br from-[#4285f4] to-[#1a73e8] rounded-2xl flex items-center justify-center shrink-0">
              <Megaphone className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Campaigns;
