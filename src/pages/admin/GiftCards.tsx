import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Gift, Search } from "lucide-react";

const GiftCards = () => {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-foreground" />
            <h1 className="text-xl font-semibold text-foreground">Gift cards</h1>
          </div>
          <Button variant="outline" size="sm" className="bg-card border-border text-foreground hover:bg-secondary">
            Export
          </Button>
        </div>

        <div className="bg-card rounded-xl border border-border p-16 text-center">
          <div className="mx-auto mb-6 w-32 h-32 bg-gradient-to-br from-[#50c8b8] to-[#3db5a4] rounded-2xl flex items-center justify-center">
            <Gift className="h-16 w-16 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">Start selling gift cards</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Add gift card products to sell or create gift cards and send them directly to your customers.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="bg-card border-border text-foreground hover:bg-secondary"
              onClick={() => navigate("/admin/gift-cards/new")}
            >
              Create gift card
            </Button>
            <Button size="sm" className="bg-primary text-white hover:bg-primary/90">
              Add gift card product
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            By using gift cards, you agree to our <a href="/terms" className="underline">Terms of Service</a>
          </p>
        </div>

        <div className="border-t border-border pt-4 text-center">
          <a href="#" className="text-sm text-primary hover:underline">Learn more about gift cards</a>
        </div>
      </div>
    </AdminLayout>
  );
};

export default GiftCards;
