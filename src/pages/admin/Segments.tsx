import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Users, X, MoreHorizontal } from "lucide-react";

const SEGMENTS = [
  { name: "Customers who have purchased at least once", pct: "37%", lastActivity: "Edited on Nov 5, 2024", createdBy: "Resurrected" },
  { name: "Email subscribers", pct: "43%", lastActivity: "Edited on Nov 5, 2024", createdBy: "Resurrected" },
  { name: "Abandoned checkouts in the last 30 days", pct: "0%", lastActivity: "Edited on Nov 5, 2024", createdBy: "Resurrected" },
  { name: "Customers who have purchased more than once", pct: "8%", lastActivity: "Edited on Nov 5, 2024", createdBy: "Resurrected" },
  { name: "Customers who haven't purchased", pct: "63%", lastActivity: "Edited on Nov 5, 2024", createdBy: "Resurrected" },
];

const SEGMENT_TEMPLATES = [
  { title: "Customers who spent a large amount per order recently", desc: "Cross-sell high spenders who have placed an order in the last 90 days with another product from the same collection.", category: "Engage high-value customers" },
  { title: "Customers who placed a lot of orders recently", desc: "Engage with customers who have placed a lot of orders recently. Offer them free shipping on their next order to encourage them to buy again.", category: "Engage high-value customers" },
  { title: "Engage with your VIP customers", desc: "Give your VIP customers early access to promotional events, sales, and new products.", category: "Engage high-value customers" },
  { title: "High spend customers with a recent purchase", desc: "Send new product drops via email to customers based on how much they've spent and when they last ordered.", category: "Engage high-value customers" },
  { title: "Customers who are likely to spend more at your store", desc: "Predicted spend tier is a prediction of your customer's spending potential in the future represented by a tier: high, medium, or low.", category: "Engage high-value customers" },
  { title: "Customers in a specific country", desc: "All customers who have an address for shipping or billing in a specific country.", category: "Target specific location" },
  { title: "Customers in a specific state or province", desc: "All customers who have an address for shipping or billing in a specific state, province, or other locality.", category: "Target specific location" },
  { title: "First-time customers who have opted in to email marketing", desc: "Drive repeat orders with product offers after a customer's first orders.", category: "Engage first-time customers" },
  { title: "Customers who haven't ordered recently but used to", desc: "Win back customers that haven't placed an order recently but have in the past year.", category: "Re-engage customers" },
  { title: "Customers who have recently made a purchase", desc: "Drive repeat sales by targeting customers who have opted in to email marketing and recently placed an order.", category: "Re-engage customers" },
  { title: "Subscribers who opened emails recently but never purchased", desc: "Engage subscribers who recently interacted with your emails. Offer a special deal for their initial purchase.", category: "Target email behavior" },
  { title: "Customers with recently abandoned checkouts", desc: "Customers who abandoned their checkouts in the last 30 days. Encourage them to come back and complete their order.", category: "Target storefront behaviors" },
];

const Segments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [templateSearch, setTemplateSearch] = useState("");

  const filteredSegments = SEGMENTS.filter((s) =>
    !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTemplates = SEGMENT_TEMPLATES.filter((t) =>
    !templateSearch || t.title.toLowerCase().includes(templateSearch.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#202223]" />
            <h1 className="text-xl font-semibold text-[#202223]">Segments</h1>
          </div>
          <Button size="sm" className="bg-[#303030] text-white hover:bg-[#1a1a1a]" onClick={() => setShowTemplates(true)}>
            Create segment
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6d7175]" />
          <input
            type="text"
            placeholder="Search segments"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-[#c9cccf] bg-white text-sm text-[#202223] placeholder:text-[#6d7175] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-[#e1e3e5] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e1e3e5] text-left">
                <th className="py-3 px-4 w-10"><Checkbox /></th>
                <th className="py-3 px-4 text-[#6d7175] font-medium">Name</th>
                <th className="py-3 px-4 text-[#6d7175] font-medium text-right">% of customers</th>
                <th className="py-3 px-4 text-[#6d7175] font-medium">Last activity</th>
                <th className="py-3 px-4 text-[#6d7175] font-medium">Created by</th>
                <th className="py-3 px-4 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filteredSegments.map((seg, i) => (
                <tr key={i} className="border-b border-[#e1e3e5] hover:bg-[#f6f6f7] cursor-pointer transition-colors">
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}><Checkbox /></td>
                  <td className="py-3 px-4 text-[#202223] font-medium">{seg.name}</td>
                  <td className="py-3 px-4 text-[#202223] text-right">{seg.pct}</td>
                  <td className="py-3 px-4 text-[#6d7175]">{seg.lastActivity}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded bg-[#95bf47] flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">R</span>
                      </div>
                      <span className="text-[#202223]">{seg.createdBy}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <MoreHorizontal className="h-4 w-4 text-[#6d7175]" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Segment Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-[#e1e3e5]">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#202223]" />
                <h2 className="text-lg font-semibold text-[#202223]">Segment templates</h2>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowTemplates(false)} className="bg-white border-[#c9cccf] text-[#202223]">
                Close
              </Button>
            </div>
            <div className="p-4 border-b border-[#e1e3e5]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6d7175]" />
                <input
                  type="text"
                  placeholder="Searching all templates"
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 rounded-lg border border-[#c9cccf] bg-white text-sm text-[#202223] placeholder:text-[#6d7175] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <div className="grid grid-cols-3 gap-3">
                {filteredTemplates.map((t, i) => (
                  <div key={i} className="border border-[#e1e3e5] rounded-xl p-4 hover:border-[#005bd3] cursor-pointer transition-colors flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-sm text-[#202223] mb-1">{t.title}</h3>
                      <p className="text-xs text-[#6d7175] leading-relaxed">{t.desc}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#e1e3e5]">
                      <span className="text-xs text-[#6d7175]">{t.category}</span>
                      <div className="w-5 h-5 rounded bg-[#95bf47] flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">R</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Segments;
