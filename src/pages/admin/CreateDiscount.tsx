import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Tag } from "lucide-react";

const CreateDiscount = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    method: "code",
    code: "",
    discountType: "percentage",
    discountValue: "",
    appliesTo: "order",
    eligibility: "all",
    minRequirement: "none",
    minAmount: "",
    minQuantity: "",
    limitTotal: false,
    maxUses: "",
    limitPerCustomer: true,
    combineProduct: false,
    combineOrder: false,
    combineShipping: false,
    startDate: new Date().toISOString().split("T")[0],
    startTime: "12:00",
    hasEndDate: false,
    endDate: "",
    endTime: "",
  });

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 12; i++) code += chars[Math.floor(Math.random() * chars.length)];
    setForm({ ...form, code });
  };

  const handleSave = async () => {
    if (!form.code) {
      toast({ title: "Error", description: "Discount code is required", variant: "destructive" });
      return;
    }
    if (!form.discountValue && form.discountType !== "free_shipping") {
      toast({ title: "Error", description: "Discount value is required", variant: "destructive" });
      return;
    }

    setSaving(true);
    const startsAt = new Date(`${form.startDate}T${form.startTime}`);
    const endsAt = form.hasEndDate && form.endDate
      ? new Date(`${form.endDate}T${form.endTime || "23:59"}`)
      : null;

    const { error } = await supabase.from("discounts").insert({
      code: form.code.toUpperCase(),
      discount_type: form.discountType,
      discount_value: form.discountType === "free_shipping" ? 0 : parseFloat(form.discountValue),
      applies_to: form.appliesTo,
      method: form.method,
      minimum_purchase_amount: form.minRequirement === "amount" ? parseFloat(form.minAmount) : null,
      minimum_quantity: form.minRequirement === "quantity" ? parseInt(form.minQuantity) : null,
      max_uses: form.limitTotal ? parseInt(form.maxUses) : null,
      max_uses_per_customer: form.limitPerCustomer ? 1 : null,
      combine_with_product_discounts: form.combineProduct,
      combine_with_order_discounts: form.combineOrder,
      combine_with_shipping_discounts: form.combineShipping,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt?.toISOString() || null,
    });

    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Discount created" });
      navigate("/admin/discounts");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[900px]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/admin/discounts")} className="p-1 hover:bg-secondary rounded">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <Tag className="h-5 w-5 text-foreground" />
          <h1 className="text-xl font-semibold text-foreground">Create discount</h1>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Main form */}
          <div className="col-span-2 space-y-4">
            {/* Method & Code */}
            <div className="bg-card rounded-xl border border-border p-5 space-y-4">
              <h2 className="font-semibold text-sm text-foreground">
                {form.discountType === "free_shipping" ? "Free shipping" : form.appliesTo === "product" ? "Amount off products" : "Amount off order"}
              </h2>
              <div>
                <Label className="text-sm text-foreground">Method</Label>
                <div className="flex gap-0 mt-1">
                  <button
                    onClick={() => setForm({ ...form, method: "code" })}
                    className={`px-4 py-2 text-sm border rounded-l-lg ${form.method === "code" ? "bg-secondary border-[#8c9196] font-medium" : "border-border"}`}
                  >
                    Discount code
                  </button>
                  <button
                    onClick={() => setForm({ ...form, method: "automatic" })}
                    className={`px-4 py-2 text-sm border-t border-b border-r rounded-r-lg ${form.method === "automatic" ? "bg-secondary border-[#8c9196] font-medium" : "border-border"}`}
                  >
                    Automatic discount
                  </button>
                </div>
              </div>
              {form.method === "code" && (
                <div>
                  <div className="flex justify-between items-center">
                    <Label className="text-sm text-foreground">Discount code</Label>
                    <button onClick={generateCode} className="text-sm text-primary hover:underline">
                      Generate random code
                    </button>
                  </div>
                  <Input
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className="mt-1 border-border"
                    placeholder="e.g. SUMMER20"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Customers must enter this code at checkout.
                  </p>
                </div>
              )}
            </div>

            {/* Discount value */}
            <div className="bg-card rounded-xl border border-border p-5 space-y-4">
              <h2 className="font-semibold text-sm text-foreground">Discount value</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Select value={form.discountType} onValueChange={(v) => setForm({ ...form, discountType: v })}>
                    <SelectTrigger className="border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed_amount">Fixed amount</SelectItem>
                      <SelectItem value="free_shipping">Free shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {form.discountType !== "free_shipping" && (
                  <div className="relative">
                    <Input
                      type="number"
                      value={form.discountValue}
                      onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                      className="border-border pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      {form.discountType === "percentage" ? "%" : "$"}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <Label className="text-sm text-foreground">Applies to</Label>
                <Select value={form.appliesTo} onValueChange={(v) => setForm({ ...form, appliesTo: v })}>
                  <SelectTrigger className="border-border mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="order">Entire order</SelectItem>
                    <SelectItem value="product">Specific products</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Minimum purchase */}
            <div className="bg-card rounded-xl border border-border p-5 space-y-3">
              <h2 className="font-semibold text-sm text-foreground">Minimum purchase requirements</h2>
              <div className="space-y-2">
                {[
                  { value: "none", label: "No minimum requirements" },
                  { value: "amount", label: "Minimum purchase amount ($)" },
                  { value: "quantity", label: "Minimum quantity of items" },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="minReq"
                      checked={form.minRequirement === opt.value}
                      onChange={() => setForm({ ...form, minRequirement: opt.value })}
                      className="accent-foreground"
                    />
                    <span className="text-sm text-foreground">{opt.label}</span>
                  </label>
                ))}
              </div>
              {form.minRequirement === "amount" && (
                <Input
                  type="number"
                  value={form.minAmount}
                  onChange={(e) => setForm({ ...form, minAmount: e.target.value })}
                  placeholder="$ 0.00"
                  className="border-border max-w-xs"
                />
              )}
              {form.minRequirement === "quantity" && (
                <Input
                  type="number"
                  value={form.minQuantity}
                  onChange={(e) => setForm({ ...form, minQuantity: e.target.value })}
                  placeholder="0"
                  className="border-border max-w-xs"
                />
              )}
            </div>

            {/* Max uses */}
            <div className="bg-card rounded-xl border border-border p-5 space-y-3">
              <h2 className="font-semibold text-sm text-foreground">Maximum discount uses</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={form.limitTotal}
                    onCheckedChange={(c) => setForm({ ...form, limitTotal: !!c })}
                  />
                  <span className="text-sm text-foreground">Limit number of times this discount can be used in total</span>
                </label>
                {form.limitTotal && (
                  <Input
                    type="number"
                    value={form.maxUses}
                    onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                    className="border-border max-w-xs"
                  />
                )}
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={form.limitPerCustomer}
                    onCheckedChange={(c) => setForm({ ...form, limitPerCustomer: !!c })}
                  />
                  <span className="text-sm text-foreground">Limit to one use per customer</span>
                </label>
              </div>
            </div>

            {/* Combinations */}
            <div className="bg-card rounded-xl border border-border p-5 space-y-3">
              <h2 className="font-semibold text-sm text-foreground">Combinations</h2>
              <div className="space-y-3">
                {[
                  { key: "combineProduct", label: "Product discounts" },
                  { key: "combineOrder", label: "Order discounts" },
                  { key: "combineShipping", label: "Shipping discounts" },
                ].map((opt) => (
                  <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={(form as any)[opt.key]}
                      onCheckedChange={(c) => setForm({ ...form, [opt.key]: !!c })}
                    />
                    <span className="text-sm text-foreground">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Active dates */}
            <div className="bg-card rounded-xl border border-border p-5 space-y-3">
              <h2 className="font-semibold text-sm text-foreground">Active dates</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm text-foreground">Start date</Label>
                  <Input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="border-border mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm text-foreground">Start time</Label>
                  <Input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className="border-border mt-1"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={form.hasEndDate}
                  onCheckedChange={(c) => setForm({ ...form, hasEndDate: !!c })}
                />
                <span className="text-sm text-foreground">Set end date</span>
              </label>
              {form.hasEndDate && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm text-foreground">End date</Label>
                    <Input
                      type="date"
                      value={form.endDate}
                      onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                      className="border-border mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-foreground">End time</Label>
                    <Input
                      type="time"
                      value={form.endTime}
                      onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                      className="border-border mt-1"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar summary */}
          <div className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-5 space-y-3">
              <h3 className="font-semibold text-sm text-foreground">
                {form.code || "No discount code yet"}
              </h3>
              <p className="text-xs text-muted-foreground">{form.method === "code" ? "Code" : "Automatic"}</p>

              <div>
                <h4 className="font-semibold text-xs text-foreground mt-2">Type</h4>
                <p className="text-xs text-muted-foreground">
                  {form.discountType === "percentage"
                    ? "Percentage"
                    : form.discountType === "fixed_amount"
                    ? "Fixed amount"
                    : "Free shipping"}
                  {form.discountValue && ` — ${form.discountType === "percentage" ? `${form.discountValue}%` : `$${form.discountValue}`}`}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-xs text-foreground">Details</h4>
                <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
                  <li>All customers</li>
                  <li>
                    {form.minRequirement === "none"
                      ? "No minimum purchase requirement"
                      : form.minRequirement === "amount"
                      ? `Minimum purchase $${form.minAmount || "0"}`
                      : `Minimum ${form.minQuantity || "0"} items`}
                  </li>
                  {form.limitPerCustomer && <li>One use per customer</li>}
                  {form.limitTotal && <li>Limited to {form.maxUses || "?"} total uses</li>}
                  <li>Active from {form.startDate}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => navigate("/admin/discounts")} className="border-border">
            Discard
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-white hover:bg-accent"
          >
            {saving ? "Saving..." : "Save discount"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateDiscount;
