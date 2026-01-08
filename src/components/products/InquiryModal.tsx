import { useState } from "react";
import { Product, ProductVariation } from "@/lib/products-data";
import { Button } from "@/components/ui/button";
import { X, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface InquiryModalProps {
  product: Product;
  variation: ProductVariation;
  onClose: () => void;
}

export const InquiryModal = ({ product, variation, onClose }: InquiryModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    quantity: variation.moq,
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("inquiries").insert({
        name: formData.name,
        business_name: formData.businessName,
        email: formData.email,
        phone: formData.phone || null,
        product_name: product.displayName,
        variation_name: `${variation.strength} – MOQ ${variation.moq} vials`,
        quantity: formData.quantity,
        message: formData.message || null,
      });

      if (error) throw error;

      setIsSuccess(true);
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast.error("Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(variation.moq, Math.round(value / variation.moq) * variation.moq);
    setFormData((prev) => ({ ...prev, quantity: newQuantity }));
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-md bg-card border border-border rounded-lg p-8 text-center animate-scale-in">
          <CheckCircle className="w-16 h-16 text-foreground mx-auto mb-6" strokeWidth={1.5} />
          <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
            Inquiry Received
          </h2>
          <p className="font-body text-muted-foreground mb-8">
            Our team will contact you shortly with pricing and availability.
          </p>
          <Button variant="hero" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-card border border-border rounded-lg animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 md:p-8">
          <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">
            Request Quote
          </h2>
          <p className="font-body text-muted-foreground mb-6">
            {product.displayName} — {variation.strength}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-heading text-sm font-medium text-foreground block mb-2">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
              />
            </div>

            <div>
              <label className="font-heading text-sm font-medium text-foreground block mb-2">
                Business Name *
              </label>
              <input
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => setFormData((prev) => ({ ...prev, businessName: e.target.value }))}
                className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
              />
            </div>

            <div>
              <label className="font-heading text-sm font-medium text-foreground block mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
              />
            </div>

            <div>
              <label className="font-heading text-sm font-medium text-foreground block mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
              />
            </div>

            <div>
              <label className="font-heading text-sm font-medium text-foreground block mb-2">
                Quantity (MOQ: {variation.moq} vials) *
              </label>
              <input
                type="number"
                required
                min={variation.moq}
                step={variation.moq}
                value={formData.quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || variation.moq)}
                className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
              />
            </div>

            <div>
              <label className="font-heading text-sm font-medium text-foreground block mb-2">
                Message (Optional)
              </label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30 resize-none"
              />
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Inquiry"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
