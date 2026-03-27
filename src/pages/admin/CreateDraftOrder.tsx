import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2, Save, Send, X } from "lucide-react";

interface DraftItem {
  id: string;
  product_name: string;
  variation_name: string;
  quantity: number;
  unit_price: number;
}

const CreateDraftOrder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<DraftItem[]>([
    { id: crypto.randomUUID(), product_name: "", variation_name: "", quantity: 1, unit_price: 0 },
  ]);

  const [shippingCost, setShippingCost] = useState("0");
  const [discountAmount, setDiscountAmount] = useState("0");

  const addItem = () => {
    setItems([...items, { id: crypto.randomUUID(), product_name: "", variation_name: "", quantity: 1, unit_price: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter(i => i.id !== id));
  };

  const updateItem = (id: string, field: keyof DraftItem, value: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const subtotal = items.reduce((sum, i) => sum + (i.quantity * i.unit_price), 0);
  const total = subtotal - Number(discountAmount) + Number(shippingCost);

  const saveDraft = async (status: string = "open") => {
    if (!items.some(i => i.product_name)) {
      toast({ title: "Error", description: "Add at least one product", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const draftNumber = `D-${Date.now().toString(36).toUpperCase()}`;
      const { data: draft, error } = await supabase.from("draft_orders").insert({
        draft_number: draftNumber,
        status,
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
          items.filter(i => i.product_name).map(i => ({
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
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/orders")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold">Create order</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => saveDraft("open")} disabled={isLoading}>
              <Save className="h-4 w-4 mr-1" /> Save draft
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Products */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Products</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, i) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-4">
                      {i === 0 && <Label className="text-xs">Product</Label>}
                      <Input
                        value={item.product_name}
                        onChange={e => updateItem(item.id, "product_name", e.target.value)}
                        placeholder="Product name"
                      />
                    </div>
                    <div className="col-span-3">
                      {i === 0 && <Label className="text-xs">Variation</Label>}
                      <Input
                        value={item.variation_name}
                        onChange={e => updateItem(item.id, "variation_name", e.target.value)}
                        placeholder="Variation"
                      />
                    </div>
                    <div className="col-span-2">
                      {i === 0 && <Label className="text-xs">Qty</Label>}
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={e => updateItem(item.id, "quantity", Number(e.target.value))}
                        min={1}
                      />
                    </div>
                    <div className="col-span-2">
                      {i === 0 && <Label className="text-xs">Price</Label>}
                      <Input
                        type="number"
                        value={item.unit_price}
                        onChange={e => updateItem(item.id, "unit_price", Number(e.target.value))}
                        min={0}
                        step="0.01"
                      />
                    </div>
                    <div className="col-span-1">
                      <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)} disabled={items.length <= 1}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-1" /> Add item
                </Button>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-muted-foreground">Discount</span>
                    <Input
                      type="number"
                      value={discountAmount}
                      onChange={e => setDiscountAmount(e.target.value)}
                      className="w-24 h-8 text-right"
                      min={0}
                      step="0.01"
                    />
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-muted-foreground">Shipping</span>
                    <Input
                      type="number"
                      value={shippingCost}
                      onChange={e => setShippingCost(e.target.value)}
                      className="w-24 h-8 text-right"
                      min={0}
                      step="0.01"
                    />
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Customer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Name</Label>
                  <Input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Customer name" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} placeholder="customer@email.com" type="email" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add notes..." rows={3} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateDraftOrder;
