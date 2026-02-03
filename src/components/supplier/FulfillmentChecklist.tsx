import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type FulfillmentStatus = "pending" | "in_production" | "packed" | "shipped" | "completed";

interface FulfillmentItem {
  id: string;
  order_item_id: string;
  product_name: string;
  variation_name: string | null;
  quantity: number;
  status: FulfillmentStatus;
}

interface FulfillmentChecklistProps {
  items: FulfillmentItem[];
  onStatusChange: (itemId: string, status: FulfillmentStatus) => void;
  disabled?: boolean;
}

const statusConfig: Record<FulfillmentStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-muted text-muted-foreground" },
  in_production: { label: "In Production", color: "bg-accent text-accent-foreground" },
  packed: { label: "Packed", color: "bg-secondary text-secondary-foreground" },
  shipped: { label: "Shipped", color: "bg-primary/20 text-primary" },
  completed: { label: "Completed", color: "bg-primary text-primary-foreground" },
};

const statusOrder: FulfillmentStatus[] = ["pending", "in_production", "packed", "shipped", "completed"];

export const FulfillmentChecklist = ({ items, onStatusChange, disabled }: FulfillmentChecklistProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Product Fulfillment</h3>
      <div className="space-y-3">
        {items.map((item) => {
          const config = statusConfig[item.status];
          const isShipped = item.status === "shipped" || item.status === "completed";

          return (
            <div
              key={item.id}
              className={cn(
                "flex items-center justify-between p-4 rounded-lg border",
                isShipped ? "bg-green-500/5 border-green-500/20" : "bg-card border-border"
              )}
            >
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={isShipped}
                  disabled={disabled || isShipped}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onStatusChange(item.id, "shipped");
                    }
                  }}
                />
                <div>
                  <p className="font-medium">{item.product_name}</p>
                  {item.variation_name && (
                    <p className="text-sm text-muted-foreground">{item.variation_name}</p>
                  )}
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Select
                  value={item.status}
                  onValueChange={(value) => onStatusChange(item.id, value as FulfillmentStatus)}
                  disabled={disabled || item.status === "completed"}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOrder.map((status) => (
                      <SelectItem key={status} value={status}>
                        {statusConfig[status].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Badge className={cn("capitalize", config.color)}>
                  {config.label}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
