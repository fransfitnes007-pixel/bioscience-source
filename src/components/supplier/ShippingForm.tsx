import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Package, Calendar } from "lucide-react";

const CARRIERS = [
  { value: "ups", label: "UPS" },
  { value: "fedex", label: "FedEx" },
  { value: "usps", label: "USPS" },
  { value: "dhl", label: "DHL" },
  { value: "other", label: "Other" },
];

interface ShippingFormData {
  carrier: string;
  trackingNumber: string;
  estimatedDeliveryDate: string;
  notes: string;
}

interface ShippingFormProps {
  initialData?: Partial<ShippingFormData>;
  onSubmit: (data: ShippingFormData) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const ShippingForm = ({ initialData, onSubmit, isLoading, disabled }: ShippingFormProps) => {
  const [formData, setFormData] = useState<ShippingFormData>({
    carrier: initialData?.carrier || "",
    trackingNumber: initialData?.trackingNumber || "",
    estimatedDeliveryDate: initialData?.estimatedDeliveryDate || "",
    notes: initialData?.notes || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Shipping Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carrier">Shipping Carrier</Label>
              <Select
                value={formData.carrier}
                onValueChange={(value) => setFormData({ ...formData, carrier: value })}
                disabled={disabled}
              >
                <SelectTrigger id="carrier">
                  <SelectValue placeholder="Select carrier" />
                </SelectTrigger>
                <SelectContent>
                  {CARRIERS.map((carrier) => (
                    <SelectItem key={carrier.value} value={carrier.value}>
                      {carrier.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="trackingNumber">Tracking Number</Label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="trackingNumber"
                  value={formData.trackingNumber}
                  onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                  placeholder="Enter tracking number"
                  className="pl-10"
                  disabled={disabled}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedDeliveryDate">Estimated Delivery Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="estimatedDeliveryDate"
                type="date"
                value={formData.estimatedDeliveryDate}
                onChange={(e) => setFormData({ ...formData, estimatedDeliveryDate: e.target.value })}
                className="pl-10"
                disabled={disabled}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Shipping Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any shipping notes or label information..."
              rows={3}
              disabled={disabled}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={disabled || isLoading || !formData.carrier || !formData.trackingNumber}
          >
            {isLoading ? "Saving..." : "Save Shipping Info"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
