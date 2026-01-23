import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable from "@/components/admin/DataTable";
import FilterPanel from "@/components/admin/FilterPanel";
import StatusBadge from "@/components/admin/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Inquiry {
  id: string;
  name: string;
  business_name: string;
  email: string;
  phone: string | null;
  product_name: string;
  product_id: string | null;
  variation_name: string | null;
  variation_id: string | null;
  quantity: number;
  message: string | null;
  status: string;
  created_at: string;
}

const ITEMS_PER_PAGE = 10;

const statusOptions = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "closed", label: "Closed" },
];

const Inquiries = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const fetchInquiries = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase.from("inquiries").select("*", { count: "exact" });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      if (searchValue) {
        query = query.or(
          `name.ilike.%${searchValue}%,business_name.ilike.%${searchValue}%,email.ilike.%${searchValue}%,product_name.ilike.%${searchValue}%`
        );
      }

      const { count } = await query;
      setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));

      const { data, error } = await query
        .order("created_at", { ascending: false })
        .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      toast({
        title: "Error",
        description: "Failed to load inquiries",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [page, searchValue, statusFilter, toast]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleRowClick = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setNewStatus(inquiry.status);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!selectedInquiry) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("inquiries")
        .update({ status: newStatus })
        .eq("id", selectedInquiry.id);

      if (error) throw error;

      toast({
        title: "Saved",
        description: "Inquiry updated successfully",
      });

      setIsDialogOpen(false);
      fetchInquiries();
    } catch (error) {
      console.error("Error updating inquiry:", error);
      toast({
        title: "Error",
        description: "Failed to update inquiry",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const columns = [
    {
      key: "product",
      header: "Product",
      cell: (inquiry: Inquiry) => (
        <div>
          <p className="font-medium">{inquiry.product_name}</p>
          {inquiry.variation_name && (
            <p className="text-sm text-muted-foreground">{inquiry.variation_name}</p>
          )}
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      cell: (inquiry: Inquiry) => (
        <div>
          <p className="font-medium">{inquiry.name}</p>
          <p className="text-sm text-muted-foreground">{inquiry.business_name}</p>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      cell: (inquiry: Inquiry) => (
        <span className="text-sm">{inquiry.email}</span>
      ),
    },
    {
      key: "quantity",
      header: "Qty",
      cell: (inquiry: Inquiry) => (
        <span className="font-medium">{inquiry.quantity}</span>
      ),
      className: "text-center",
    },
    {
      key: "status",
      header: "Status",
      cell: (inquiry: Inquiry) => <StatusBadge status={inquiry.status} />,
    },
    {
      key: "created_at",
      header: "Date",
      cell: (inquiry: Inquiry) => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(inquiry.created_at), "MMM d, yyyy")}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Inquiries</h1>
          <p className="text-muted-foreground mt-1">
            Manage product inquiries and quote requests
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Inquiries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FilterPanel
              searchValue={searchValue}
              onSearchChange={(value) => {
                setSearchValue(value);
                setPage(1);
              }}
              searchPlaceholder="Search by name, business, email, or product..."
              statusValue={statusFilter}
              onStatusChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
              statusOptions={statusOptions}
              onClear={() => {
                setSearchValue("");
                setStatusFilter("all");
                setPage(1);
              }}
            />

            <DataTable
              columns={columns}
              data={inquiries}
              isLoading={isLoading}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              onRowClick={handleRowClick}
              emptyMessage="No inquiries found"
            />
          </CardContent>
        </Card>

        {/* Inquiry Detail Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Inquiry Details</DialogTitle>
            </DialogHeader>

            {selectedInquiry && (
              <div className="space-y-6">
                {/* Product Info */}
                <div className="p-4 rounded-lg bg-accent/50">
                  <p className="text-lg font-semibold">{selectedInquiry.product_name}</p>
                  {selectedInquiry.variation_name && (
                    <p className="text-muted-foreground">{selectedInquiry.variation_name}</p>
                  )}
                  <p className="text-2xl font-bold mt-2">
                    Quantity: {selectedInquiry.quantity}
                  </p>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Name</Label>
                    <p className="font-medium">{selectedInquiry.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Business</Label>
                    <p className="font-medium">{selectedInquiry.business_name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <a
                      href={`mailto:${selectedInquiry.email}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {selectedInquiry.email}
                    </a>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="font-medium">{selectedInquiry.phone || "-"}</p>
                  </div>
                </div>

                {/* Message */}
                {selectedInquiry.message && (
                  <div>
                    <Label className="text-muted-foreground">Message</Label>
                    <p className="font-medium p-3 rounded-lg bg-muted mt-1">
                      {selectedInquiry.message}
                    </p>
                  </div>
                )}

                {/* Status & Actions */}
                <div className="space-y-4 pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Status</Label>
                      <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Submitted</Label>
                      <p className="font-medium">
                        {format(new Date(selectedInquiry.created_at), "PPpp")}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Inquiries;
