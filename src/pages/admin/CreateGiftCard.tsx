import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Gift, Search, Pencil } from "lucide-react";

const CreateGiftCard = () => {
  const navigate = useNavigate();
  const [code] = useState(() => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  });
  const [value, setValue] = useState("10.00");
  const [customerSearch, setCustomerSearch] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-[#6d7175]">
          <button onClick={() => navigate("/admin/gift-cards")} className="hover:text-[#202223] flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            <Gift className="h-4 w-4" />
          </button>
          <span>›</span>
          <span className="text-[#202223] font-semibold">Create gift card</span>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Left */}
          <div className="col-span-8">
            <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 space-y-5">
              <h2 className="font-semibold text-[#202223]">Gift card details</h2>

              <div>
                <label className="block text-sm text-[#202223] font-medium mb-1">Gift card code</label>
                <input
                  type="text"
                  value={code}
                  readOnly
                  className="w-full h-10 px-3 rounded-lg border border-[#c9cccf] bg-[#f6f6f7] text-sm text-[#202223] font-mono"
                />
              </div>

              <div>
                <label className="block text-sm text-[#202223] font-medium mb-1">Initial value</label>
                <div className="relative w-64">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#6d7175]">$</span>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    step="0.01"
                    className="w-full h-10 pl-7 pr-3 rounded-lg border border-[#c9cccf] text-sm text-[#202223] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-[#6d7175]">
                <span>📅</span>
                <span>Doesn't expire</span>
              </div>
              <p className="text-xs text-[#6d7175]">Gift card expiration laws can vary by country</p>
            </div>
          </div>

          {/* Right */}
          <div className="col-span-4 space-y-4">
            <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 space-y-3">
              <h2 className="font-semibold text-[#202223]">Customer</h2>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6d7175]" />
                <input
                  type="text"
                  placeholder="Search or create customer"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full h-10 pl-8 pr-3 rounded-lg border border-[#c9cccf] text-sm text-[#202223] placeholder:text-[#6d7175] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-[#202223]">Notes</h2>
                <Pencil className="h-4 w-4 text-[#6d7175]" />
              </div>
              <p className="text-sm text-[#6d7175]">{notes || "No notes"}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button size="sm" className="bg-[#303030] text-white hover:bg-[#1a1a1a]">Save</Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateGiftCard;
