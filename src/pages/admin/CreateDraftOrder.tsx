import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, X, Search, Pencil } from "lucide-react";

interface DraftItem {
  id: string;
  product_name: string;
  variation_name: string;
  quantity: number;
  unit_price: number;
  is_taxable: boolean;
  is_physical: boolean;
  weight: number;
}

const CreateDraftOrder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomItem, setShowCustomItem] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<DraftItem[]>([]);

  const [shippingCost, setShippingCost] = useState("0");
  const [discountAmount, setDiscountAmount] = useState("0");

  // Custom item form
  const [customName, setCustomName] = useState("");
  const [customPrice, setCustomPrice] = useState("0.00");
  const [customQty, setCustomQty] = useState("1");
  const [customTaxable, setCustomTaxable] = useState(true);
  const [customPhysical, setCustomPhysical] = useState(true);
  const [customWeight, setCustomWeight] = useState("0");

  const addCustomItem = () => {
    if (!customName) return;
    setItems([...items, {
      id: crypto.randomUUID(),
      product_name: customName,
      variation_name: "",
      quantity: Number(customQty),
      unit_price: Number(customPrice),
      is_taxable: customTaxable,
      is_physical: customPhysical,
      weight: Number(customWeight),
    }]);
    setCustomName("");
    setCustomPrice("0.00");
    setCustomQty("1");
    setShowCustomItem(false);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const subtotal = items.reduce((sum, i) => sum + (i.quantity * i.unit_price), 0);
  const total = subtotal - Number(discountAmount) + Number(shippingCost);

  const saveDraft = async () => {
    if (items.length === 0) {
      toast({ title: "Error", description: "Add at least one product", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const draftNumber = `D-${Date.now().toString(36).toUpperCase()}`;
      const { data: draft, error } = await supabase.from("draft_orders").insert({
        draft_number: draftNumber,
        status: "open",
        customer_email: customerEmail,
        customer_name: customerName,
        notes,
        subtotal,
        discount_amount: Number(discountAmount),
        shipping_cost: Number(shippingCost),
        total,
        created_by: (await supabase.auth.getSession()).data.session?.user?.id,
      }).select().single();

      if (error) throw error;

      if (draft) {
        await supabase.from("draft_order_items").insert(
          items.map(i => ({
            draft_order_id: draft.id,
            product_name: i.product_name,
            variation_name: i.variation_name,
            quantity: i.quantity,
            unit_price: i.unit_price,
            total_price: i.quantity * i.unit_price,
          }))
        );
      }

      toast({ title: "Draft saved", description: `Draft order ${draftNumber} created` });
      navigate("/admin/orders/drafts");
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to save draft order", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/admin/orders")} className="p-1 rounded hover:bg-[#e1e3e5]">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">Create order</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Products Card */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="font-semibold text-foreground">Products</h2>
              </div>
              <div className="p-5">
                {items.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.product_name}</p>
                          <p className="text-xs text-muted-foreground">${item.unit_price.toFixed(2)} × {item.quantity}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-foreground">${(item.unit_price * item.quantity).toFixed(2)}</span>
                          <button onClick={() => removeItem(item.id)} className="p-1 rounded hover:bg-[#e1e3e5]">
                            <X className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search products"
                      className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="bg-card border-border text-foreground hover:bg-secondary">
                    Browse
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-card border-border text-foreground hover:bg-secondary"
                    onClick={() => setShowCustomItem(true)}
                  >
                    Add custom item
                  </Button>
                </div>
              </div>
            </div>

            {/* Payment Card */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="font-semibold text-foreground">Payment</h2>
              </div>
              <div className="p-5">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Add discount</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">—</span>
                      <span className="text-foreground">${Number(discountAmount).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Add shipping or delivery</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">—</span>
                      <span className="text-foreground">${Number(shippingCost).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Estimated tax</span>
                    <span className="text-muted-foreground">Not calculated</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-semibold">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">${total.toFixed(2)}</span>
                  </div>
                </div>
                {items.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-4 pt-4 border-t border-border">
                    Add a product to calculate total and view payment options
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Notes */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="px-5 py-4 flex items-center justify-between border-b border-border">
                <h2 className="font-semibold text-foreground">Notes</h2>
                <button onClick={() => setShowNotes(!showNotes)} className="p-1 rounded hover:bg-[#e1e3e5]">
                  <Pencil className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <div className="p-5">
                {showNotes ? (
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Add notes..."
                    className="w-full h-20 px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{notes || "No notes"}</p>
                )}
              </div>
            </div>

            {/* Customer */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="font-semibold text-foreground">Customer</h2>
              </div>
              <div className="p-5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search or create a customer"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Customer email"
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  className="w-full h-9 px-3 mt-3 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="px-5 py-4 flex items-center justify-between border-b border-border">
                <h2 className="font-semibold text-foreground">Tags</h2>
                <button className="p-1 rounded hover:bg-[#e1e3e5]">
                  <Pencil className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <div className="p-5">
                <input
                  type="text"
                  placeholder="Add tags..."
                  className="w-full h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save bar */}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            className="bg-card border-border text-foreground hover:bg-secondary"
            onClick={() => navigate("/admin/orders")}
          >
            Discard
          </Button>
          <Button
            className="bg-primary text-white hover:bg-primary/90"
            onClick={saveDraft}
            disabled={isLoading}
          >
            Save draft
          </Button>
        </div>
      </div>

      {/* Custom Item Dialog */}
      <Dialog open={showCustomItem} onOpenChange={setShowCustomItem}>
        <DialogContent className="bg-card border-border text-foreground max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add custom item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-3 sm:col-span-1 sm:col-start-1 sm:col-end-2">
                <Label className="text-sm text-foreground">Item name</Label>
                <input
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  className="w-full h-9 px-3 mt-1 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <Label className="text-sm text-foreground">Price</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                  <input
                    type="number"
                    value={customPrice}
                    onChange={e => setCustomPrice(e.target.value)}
                    className="w-full h-9 pl-7 pr-3 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm text-foreground">Quantity</Label>
                <input
                  type="number"
                  value={customQty}
                  onChange={e => setCustomQty(e.target.value)}
                  className="w-full h-9 px-3 mt-1 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  min="1"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm text-foreground">
                <Checkbox checked={customTaxable} onCheckedChange={(v) => setCustomTaxable(!!v)} />
                Item is taxable
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <Checkbox checked={customPhysical} onCheckedChange={(v) => setCustomPhysical(!!v)} />
                Item is a physical product
              </label>
            </div>
            {customPhysical && (
              <div>
                <Label className="text-sm text-muted-foreground">Item weight (optional)</Label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="number"
                    value={customWeight}
                    onChange={e => setCustomWeight(e.target.value)}
                    className="flex-1 h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    min="0"
                    step="0.01"
                  />
                  <div className="h-9 px-3 rounded-lg border border-border bg-secondary text-sm text-foreground flex items-center">
                    kg
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Used to calculate shipping rates accurately</p>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="bg-card border-border text-foreground" onClick={() => setShowCustomItem(false)}>
              Cancel
            </Button>
            <Button className="bg-primary text-white hover:bg-primary/90" onClick={addCustomItem}>
              Add item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default CreateDraftOrder;
