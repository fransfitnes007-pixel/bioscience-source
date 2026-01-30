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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";

interface Application {
  id: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  business_type: string | null;
  website: string | null;
  business_address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string | null;
  intended_use: string | null;
  referral_source: string | null;
  monthly_volume: string | null;
  products_interest: string | null;
  product_usage: string | null;
  how_we_benefit: string | null;
  company_impact: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

const ITEMS_PER_PAGE = 10;

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "denied", label: "Denied" },
];

const Applications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("applications")
        .select("*", { count: "exact" });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter as "pending" | "approved" | "denied");
      }

      if (searchValue) {
        query = query.or(
          `business_name.ilike.%${searchValue}%,contact_name.ilike.%${searchValue}%,email.ilike.%${searchValue}%`
        );
      }

      const { count } = await query;
      setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));

      const { data, error } = await query
        .order("created_at", { ascending: false })
        .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [page, searchValue, statusFilter, toast]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleRowClick = (app: Application) => {
    setSelectedApp(app);
    setNotes(app.notes || "");
    setNewStatus(app.status);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!selectedApp) return;

    setIsSaving(true);
    const wasApproved = selectedApp.status !== "approved" && newStatus === "approved";
    
    try {
      // If approving, first create the partner account
      if (wasApproved) {
        // Create partner account via edge function
        const { data: accountData, error: accountError } = await supabase.functions.invoke("create-partner-account", {
          body: {
            applicationId: selectedApp.id,
            email: selectedApp.email,
            contactName: selectedApp.contact_name,
            businessName: selectedApp.business_name,
            phone: selectedApp.phone,
            website: selectedApp.website,
            country: selectedApp.country,
          },
        });

        if (accountError || !accountData?.success) {
          console.error("Failed to create partner account:", accountError || accountData?.error);
          toast({
            title: "Error",
            description: accountData?.error || "Failed to create partner account",
            variant: "destructive",
          });
          setIsSaving(false);
          return;
        }

        // Update application status
        const { error: updateError } = await supabase
          .from("applications")
          .update({
            status: "approved" as const,
            notes,
            reviewed_at: new Date().toISOString(),
          })
          .eq("id", selectedApp.id);

        if (updateError) throw updateError;

        // Send welcome email with setup link
        const { error: emailError } = await supabase.functions.invoke("send-application-email", {
          body: {
            type: "approved",
            email: selectedApp.email,
            contactName: selectedApp.contact_name,
            businessName: selectedApp.business_name,
            setupLink: accountData.setupLink,
          },
        });

        if (emailError) {
          console.error("Failed to send approval email:", emailError);
          toast({
            title: "Account Created",
            description: "Partner account created but welcome email failed to send. Please resend manually.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Approved",
            description: "Partner account created and setup email sent",
          });
        }
      } else {
        // Just update status without creating account
        const { error } = await supabase
          .from("applications")
          .update({
            status: newStatus as "pending" | "approved" | "denied",
            notes,
            reviewed_at: new Date().toISOString(),
          })
          .eq("id", selectedApp.id);

        if (error) throw error;

        toast({
          title: "Saved",
          description: "Application updated successfully",
        });
      }

      setIsDialogOpen(false);
      fetchApplications();
    } catch (error) {
      console.error("Error updating application:", error);
      toast({
        title: "Error",
        description: "Failed to update application",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const columns = [
    {
      key: "business_name",
      header: "Business",
      cell: (app: Application) => (
        <div>
          <p className="font-medium">{app.business_name}</p>
          <p className="text-sm text-muted-foreground">{app.business_type}</p>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      cell: (app: Application) => (
        <div>
          <p className="font-medium">{app.contact_name}</p>
          <p className="text-sm text-muted-foreground">{app.email}</p>
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
      cell: (app: Application) => (
        <div className="text-sm">
          {app.city && app.state ? `${app.city}, ${app.state}` : app.country || "-"}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (app: Application) => <StatusBadge status={app.status} />,
    },
    {
      key: "created_at",
      header: "Date",
      cell: (app: Application) => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(app.created_at), "MMM d, yyyy")}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Applications</h1>
          <p className="text-muted-foreground mt-1">
            Manage business partner applications
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Applications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FilterPanel
              searchValue={searchValue}
              onSearchChange={(value) => {
                setSearchValue(value);
                setPage(1);
              }}
              searchPlaceholder="Search by business, name, or email..."
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
              data={applications}
              isLoading={isLoading}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              onRowClick={handleRowClick}
              emptyMessage="No applications found"
            />
          </CardContent>
        </Card>

        {/* Application Detail Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
            </DialogHeader>

            {selectedApp && (
              <div className="space-y-6">
                {/* Business Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Business Name</Label>
                    <p className="font-medium">{selectedApp.business_name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Business Type</Label>
                    <p className="font-medium">{selectedApp.business_type || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Contact Name</Label>
                    <p className="font-medium">{selectedApp.contact_name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{selectedApp.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="font-medium">{selectedApp.phone || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Website</Label>
                    {selectedApp.website ? (
                      <a
                        href={selectedApp.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary flex items-center gap-1 hover:underline"
                      >
                        {selectedApp.website}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <p className="font-medium">-</p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <Label className="text-muted-foreground">Address</Label>
                  <p className="font-medium">
                    {[
                      selectedApp.business_address,
                      selectedApp.city,
                      selectedApp.state,
                      selectedApp.zip_code,
                      selectedApp.country,
                    ]
                      .filter(Boolean)
                      .join(", ") || "-"}
                  </p>
                </div>

                {/* Business Details */}
                <div className="space-y-4">
                  {selectedApp.intended_use && (
                    <div>
                      <Label className="text-muted-foreground">Intended Use</Label>
                      <p className="font-medium">{selectedApp.intended_use}</p>
                    </div>
                  )}
                  {selectedApp.products_interest && (
                    <div>
                      <Label className="text-muted-foreground">Products of Interest</Label>
                      <p className="font-medium">{selectedApp.products_interest}</p>
                    </div>
                  )}
                  {selectedApp.monthly_volume && (
                    <div>
                      <Label className="text-muted-foreground">Monthly Volume</Label>
                      <p className="font-medium">{selectedApp.monthly_volume}</p>
                    </div>
                  )}
                  {selectedApp.referral_source && (
                    <div>
                      <Label className="text-muted-foreground">Referral Source</Label>
                      <p className="font-medium">{selectedApp.referral_source}</p>
                    </div>
                  )}
                  {selectedApp.how_we_benefit && (
                    <div>
                      <Label className="text-muted-foreground">How We Benefit</Label>
                      <p className="font-medium">{selectedApp.how_we_benefit}</p>
                    </div>
                  )}
                  {selectedApp.company_impact && (
                    <div>
                      <Label className="text-muted-foreground">Company Impact</Label>
                      <p className="font-medium">{selectedApp.company_impact}</p>
                    </div>
                  )}
                </div>

                {/* Status & Notes */}
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
                        {format(new Date(selectedApp.created_at), "PPpp")}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label>Internal Notes</Label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes about this application..."
                      rows={3}
                    />
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

export default Applications;
