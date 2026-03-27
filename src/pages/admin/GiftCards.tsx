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
            <Gift className="h-5 w-5 text-[#202223]" />
            <h1 className="text-xl font-semibold text-[#202223]">Gift cards</h1>
          </div>
          <Button variant="outline" size="sm" className="bg-white border-[#c9cccf] text-[#202223] hover:bg-[#f6f6f7]">
            Export
          </Button>
        </div>

        <div className="bg-white rounded-xl border border-[#e1e3e5] p-16 text-center">
          <div className="mx-auto mb-6 w-32 h-32 bg-gradient-to-br from-[#50c8b8] to-[#3db5a4] rounded-2xl flex items-center justify-center">
            <Gift className="h-16 w-16 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-[#202223] mb-2">Start selling gift cards</h2>
          <p className="text-sm text-[#6d7175] mb-6 max-w-md mx-auto">
            Add gift card products to sell or create gift cards and send them directly to your customers.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-[#c9cccf] text-[#202223] hover:bg-[#f6f6f7]"
              onClick={() => navigate("/admin/gift-cards/new")}
            >
              Create gift card
            </Button>
            <Button size="sm" className="bg-[#303030] text-white hover:bg-[#1a1a1a]">
              Add gift card product
            </Button>
          </div>
          <p className="text-xs text-[#6d7175] mt-4">
            By using gift cards, you agree to our <a href="/terms" className="underline">Terms of Service</a>
          </p>
        </div>

        <div className="border-t border-[#e1e3e5] pt-4 text-center">
          <a href="#" className="text-sm text-[#005bd3] hover:underline">Learn more about gift cards</a>
        </div>
      </div>
    </AdminLayout>
  );
};

export default GiftCards;
