import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Search, ArrowRightLeft } from "lucide-react";

const CreateTransfer = () => {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [notes, setNotes] = useState("");
  const [reference, setReference] = useState("");
  const [tags, setTags] = useState("");

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-[#6d7175]">
          <button onClick={() => navigate("/admin/transfers")} className="hover:text-[#202223] flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            <ArrowRightLeft className="h-4 w-4" />
          </button>
          <span>›</span>
          <span className="text-[#202223] font-semibold">Create transfer</span>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Left */}
          <div className="col-span-8 space-y-4">
            {/* Origin / Destination */}
            <div className="bg-white rounded-xl border border-[#e1e3e5] overflow-hidden">
              <div className="grid grid-cols-2 divide-x divide-[#e1e3e5]">
                <div className="p-5">
                  <label className="block text-sm font-medium text-[#202223] mb-1">Origin ⓘ</label>
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#c9cccf] text-sm text-[#202223] bg-white focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                  >
                    <option value="">Select origin</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="store">Store</option>
                  </select>
                </div>
                <div className="p-5">
                  <label className="block text-sm font-medium text-[#202223] mb-1">Destination ⓘ</label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#c9cccf] text-sm text-[#202223] bg-white focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                  >
                    <option value="">Select destination</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="store">Store</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Add products */}
            <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 space-y-3">
              <h2 className="font-semibold text-[#202223]">Add products</h2>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6d7175]" />
                  <input
                    type="text"
                    placeholder="Search products"
                    className="w-full h-10 pl-8 pr-3 rounded-lg border border-[#c9cccf] text-sm text-[#202223] placeholder:text-[#6d7175] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                  />
                </div>
                <Button variant="outline" size="sm" className="bg-white border-[#c9cccf] text-[#202223] hover:bg-[#f6f6f7]">
                  Browse
                </Button>
                <Button variant="outline" size="sm" className="bg-white border-[#c9cccf] text-[#202223] hover:bg-[#f6f6f7]">
                  Import
                </Button>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="col-span-4 space-y-4">
            <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 space-y-2">
              <h2 className="font-semibold text-[#202223]">Notes</h2>
              <p className="text-sm text-[#6d7175]">{notes || "No notes"}</p>
            </div>

            <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 space-y-3">
              <h2 className="font-semibold text-[#202223]">Transfer details</h2>
              <div>
                <label className="block text-sm text-[#6d7175] mb-1">Date created</label>
                <input
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  className="w-full h-10 px-3 rounded-lg border border-[#c9cccf] text-sm text-[#202223] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                />
              </div>
              <div>
                <label className="block text-sm text-[#6d7175] mb-1">Reference name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    maxLength={255}
                    className="w-full h-10 px-3 rounded-lg border border-[#c9cccf] text-sm text-[#202223] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#6d7175]">{reference.length}/255</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#e1e3e5] p-5 space-y-3">
              <h2 className="font-semibold text-[#202223]">Tags</h2>
              <div className="relative">
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  maxLength={40}
                  className="w-full h-10 px-3 rounded-lg border border-[#c9cccf] text-sm text-[#202223] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#6d7175]">{tags.length}/40</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateTransfer;
