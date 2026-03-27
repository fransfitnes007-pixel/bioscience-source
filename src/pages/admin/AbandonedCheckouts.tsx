import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const AbandonedCheckouts = () => {
  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-[#202223]" />
          <h1 className="text-xl font-semibold text-[#202223]">Abandoned checkouts</h1>
        </div>

        <div className="bg-white rounded-xl border border-[#e1e3e5] overflow-hidden">
          <div className="flex items-center justify-between p-8">
            <div className="max-w-lg">
              <h2 className="text-lg font-semibold text-[#202223] mb-2">Abandoned checkouts will show here</h2>
              <p className="text-sm text-[#6d7175]">
                See when customers put an item in their cart but don't check out. You can also email customers a link to their cart.
              </p>
            </div>
            <div className="w-32 h-32 rounded-full bg-[#f6f6f7] flex items-center justify-center shrink-0 ml-8">
              <ShoppingCart className="h-14 w-14 text-[#b5b5b5]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e1e3e5] p-6">
          <h3 className="font-semibold text-[#202223] mb-2">Recover sales with your abandoned checkout email</h3>
          <p className="text-sm text-[#6d7175] mb-4">
            An automated email is already created for you. Take a moment to review the email and make any additional adjustments to the design, messaging, or recipient list.
          </p>
          <Button variant="outline" className="bg-white border-[#c9cccf] text-[#202223] hover:bg-[#f6f6f7]">
            Review email
          </Button>
        </div>

        <p className="text-center text-sm text-[#6d7175]">
          Learn more about abandoned checkouts
        </p>
      </div>
    </AdminLayout>
  );
};

export default AbandonedCheckouts;
