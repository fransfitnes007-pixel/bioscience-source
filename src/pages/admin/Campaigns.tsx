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
            <Megaphone className="h-5 w-5 text-foreground" />
            <h1 className="text-xl font-semibold text-foreground">Campaigns</h1>
          </div>
          <Button size="sm" className="bg-primary text-white hover:bg-primary/90" onClick={() => navigate("/admin/marketing/campaigns/new")}>
            Create campaign
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground bg-card">✨ 24 unassigned activities</span>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">All</span>
          </div>
          <div className="p-12 text-center flex items-center justify-between">
            <div className="max-w-lg text-left">
              <h2 className="font-semibold text-foreground text-lg mb-2">Centralize your campaign tracking</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Create campaigns to evaluate how marketing initiatives drive business goals. Capture online and offline touchpoints,
                add campaign activities from multiple marketing channels, and monitor results.
              </p>
              <div className="flex items-center gap-2">
                <Button size="sm" className="bg-primary text-white hover:bg-primary/90" onClick={() => navigate("/admin/marketing/campaigns/new")}>
                  Create campaign
                </Button>
                <Button variant="outline" size="sm" className="bg-card border-border text-foreground hover:bg-secondary">
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
