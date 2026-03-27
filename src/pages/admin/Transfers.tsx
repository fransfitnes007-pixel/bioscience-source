import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft } from "lucide-react";

const Transfers = () => {
  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-[#202223]" />
            <h1 className="text-xl font-semibold text-[#202223]">Transfers</h1>
          </div>
          <Button variant="outline" size="sm" className="bg-white border-[#c9cccf] text-[#202223] hover:bg-[#f6f6f7]">
            Transfers report
          </Button>
        </div>

        <div className="bg-white rounded-xl border border-[#e1e3e5] p-16 text-center">
          {/* Illustration placeholder */}
          <div className="mx-auto mb-6 w-32 h-32 bg-[#f6f6f7] rounded-full flex items-center justify-center">
            <div className="flex items-center gap-1">
              <div className="w-10 h-12 bg-[#d9d9d9] rounded-lg relative">
                <div className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-[#50b83c]" />
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#6d7175]">6</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#50b83c] flex items-center justify-center">
                <ArrowRightLeft className="h-4 w-4 text-white" />
              </div>
              <div className="w-10 h-12 bg-[#b4e1fa] rounded-lg relative">
                <div className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-[#50b83c]" />
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#6d7175]">4</span>
              </div>
            </div>
          </div>
          <h2 className="text-lg font-semibold text-[#202223] mb-2">Move inventory between locations</h2>
          <p className="text-sm text-[#6d7175] mb-6">Move and track inventory between your business locations.</p>
          <Button size="sm" className="bg-[#303030] text-white hover:bg-[#1a1a1a]">
            Create transfer
          </Button>
        </div>

        <div className="border-t border-[#e1e3e5] pt-4 text-center">
          <a href="#" className="text-sm text-[#005bd3] hover:underline">Learn more about transfers</a>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Transfers;
