import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Users, Plus, Mail, Phone, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Supplier {
  id: string;
  user_id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  phone: string | null;
  address: string | null;
  is_active: boolean;
  created_at: string;
  orders_count?: number;
}

const AdminSuppliers = () => {
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newSupplier, setNewSupplier] = useState({
    company_name: "",
    contact_name: "",
    contact_email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get order counts for each supplier
      const suppliersWithCounts = await Promise.all(
        (data || []).map(async (supplier) => {
          const { count } = await supabase
            .from("supplier_order_assignments")
            .select("*", { count: "exact", head: true })
            .eq("supplier_id", supplier.id);
          
          return { ...supplier, orders_count: count || 0 };
        })
      );

      setSuppliers(suppliersWithCounts);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      toast({
        title: "Error",
        description: "Failed to load suppliers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSupplier = async () => {
    if (!newSupplier.company_name || !newSupplier.contact_email || !newSupplier.contact_name) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Call edge function to create supplier account
      const response = await supabase.functions.invoke("create-supplier-account", {
        body: {
          email: newSupplier.contact_email,
          company_name: newSupplier.company_name,
          contact_name: newSupplier.contact_name,
          phone: newSupplier.phone || null,
          address: newSupplier.address || null,
        },
      });

      if (response.error) throw response.error;

      toast({
        title: "Supplier Created",
        description: "An invitation email has been sent to the supplier",
      });

      setIsDialogOpen(false);
      setNewSupplier({
        company_name: "",
        contact_name: "",
        contact_email: "",
        phone: "",
        address: "",
      });
      
      fetchSuppliers();
    } catch (error: any) {
      console.error("Error creating supplier:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create supplier",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSupplierStatus = async (supplierId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("suppliers")
        .update({ is_active: isActive })
        .eq("id", supplierId);

      if (error) throw error;

      setSuppliers((prev) =>
        prev.map((s) => (s.id === supplierId ? { ...s, is_active: isActive } : s))
      );

      toast({
        title: "Status Updated",
        description: `Supplier ${isActive ? "activated" : "deactivated"}`,
      });
    } catch (error) {
      console.error("Error updating supplier:", error);
      toast({
        title: "Error",
        description: "Failed to update supplier status",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Supplier Management</h1>
            <p className="text-muted-foreground">Manage your fulfillment partners</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Supplier
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Supplier</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name *</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="company_name"
                      value={newSupplier.company_name}
                      onChange={(e) => setNewSupplier({ ...newSupplier, company_name: e.target.value })}
                      placeholder="Acme Fulfillment Co."
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_name">Contact Name *</Label>
                  <Input
                    id="contact_name"
                    value={newSupplier.contact_name}
                    onChange={(e) => setNewSupplier({ ...newSupplier, contact_name: e.target.value })}
                    placeholder="John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contact_email"
                      type="email"
                      value={newSupplier.contact_email}
                      onChange={(e) => setNewSupplier({ ...newSupplier, contact_email: e.target.value })}
                      placeholder="supplier@company.com"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={newSupplier.phone}
                      onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={newSupplier.address}
                    onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                    placeholder="123 Warehouse St, City, State"
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleCreateSupplier}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Supplier Account"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Suppliers ({suppliers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : suppliers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No suppliers yet</p>
                <p className="text-sm">Add your first supplier to get started</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.company_name}</TableCell>
                      <TableCell>{supplier.contact_name}</TableCell>
                      <TableCell>{supplier.contact_email}</TableCell>
                      <TableCell>{supplier.orders_count}</TableCell>
                      <TableCell>
                        <Badge variant={supplier.is_active ? "default" : "secondary"}>
                          {supplier.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(supplier.created_at), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <Switch
                          checked={supplier.is_active}
                          onCheckedChange={(checked) => toggleSupplierStatus(supplier.id, checked)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSuppliers;
