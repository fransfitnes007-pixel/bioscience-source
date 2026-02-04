import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FilterPanel from "@/components/admin/FilterPanel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Mail, Phone, Globe, Package, MessageSquare, Eye, FileImage, Tags } from "lucide-react";
import { Link } from "react-router-dom";

interface Business {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  business_name: string | null;
  business_email: string | null;
  phone: string | null;
  website: string | null;
  country: string | null;
  status: string;
  created_at: string;
  company_logo_url: string | null;
  order_count?: number;
  total_spent?: number;
}

const AdminBusinesses = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      // Fetch profiles (businesses)
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!profiles) {
        setLoading(false);
        return;
      }

      // Fetch order stats for each business
      const businessesWithStats = await Promise.all(
        profiles.map(async (profile) => {
          const { data: orders } = await supabase
            .from('orders')
            .select('total')
            .eq('user_id', profile.user_id);

          return {
            ...profile,
            order_count: orders?.length || 0,
            total_spent: orders?.reduce((sum, o) => sum + Number(o.total), 0) || 0,
          };
        })
      );

      setBusinesses(businessesWithStats);
      setFilteredBusinesses(businessesWithStats);
      setLoading(false);
    };

    fetchBusinesses();
  }, []);

  useEffect(() => {
    let filtered = businesses;

    if (searchValue) {
      const search = searchValue.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.business_name?.toLowerCase().includes(search) ||
          b.first_name?.toLowerCase().includes(search) ||
          b.last_name?.toLowerCase().includes(search) ||
          b.business_email?.toLowerCase().includes(search)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((b) => b.status === statusFilter);
    }

    setFilteredBusinesses(filtered);
  }, [searchValue, statusFilter, businesses]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>;
      case 'denied':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Denied</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const statusOptions = [
    { value: "approved", label: "Approved" },
    { value: "pending", label: "Pending" },
    { value: "denied", label: "Denied" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Businesses</h1>
          <p className="text-muted-foreground">Manage all registered customers and businesses</p>
        </div>

        <FilterPanel
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search businesses..."
          statusValue={statusFilter}
          onStatusChange={setStatusFilter}
          statusOptions={statusOptions}
          onClear={() => {
            setSearchValue("");
            setStatusFilter("all");
          }}
        />

        <Card>
          <CardHeader>
            <CardTitle>All Businesses</CardTitle>
            <CardDescription>
              {filteredBusinesses.length} {filteredBusinesses.length === 1 ? "business" : "businesses"} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredBusinesses.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No businesses found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business</TableHead>
                    <TableHead>Logo</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBusinesses.map((business) => (
                    <TableRow key={business.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{business.business_name || "N/A"}</p>
                          <p className="text-sm text-muted-foreground">
                            {business.first_name} {business.last_name}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {business.company_logo_url ? (
                          <div className="w-10 h-10 rounded border border-border overflow-hidden bg-secondary/30 flex items-center justify-center">
                            {business.company_logo_url.toLowerCase().endsWith('.pdf') ? (
                              <FileImage className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <img
                                src={business.company_logo_url}
                                alt="Logo"
                                className="w-full h-full object-contain p-1"
                              />
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{business.business_email}</p>
                        {business.phone && (
                          <p className="text-sm text-muted-foreground">{business.phone}</p>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(business.status)}</TableCell>
                      <TableCell>{business.order_count}</TableCell>
                      <TableCell>{formatCurrency(business.total_spent || 0)}</TableCell>
                      <TableCell>{formatDate(business.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedBusiness(business)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Business Details Dialog */}
        <Dialog open={!!selectedBusiness} onOpenChange={() => setSelectedBusiness(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {selectedBusiness?.business_name || "Business Details"}
              </DialogTitle>
              <DialogDescription>
                Full details for this business account
              </DialogDescription>
            </DialogHeader>

            {selectedBusiness && (
              <div className="space-y-6">
                {/* Status */}
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Status:</span>
                  {getStatusBadge(selectedBusiness.status)}
                </div>

                {/* Contact Info */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Contact Name</p>
                    <p className="font-medium">
                      {selectedBusiness.first_name} {selectedBusiness.last_name}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" /> Email
                    </p>
                    <p className="font-medium">{selectedBusiness.business_email || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Phone
                    </p>
                    <p className="font-medium">{selectedBusiness.phone || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Globe className="h-3 w-3" /> Website
                    </p>
                    <p className="font-medium">{selectedBusiness.website || "N/A"}</p>
                  </div>
                </div>

                {/* Company Logo */}
                {selectedBusiness.company_logo_url && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                      <Tags className="h-3 w-3" /> Company Logo
                    </p>
                    <div className="w-24 h-24 rounded-lg border border-border overflow-hidden bg-background flex items-center justify-center">
                      {selectedBusiness.company_logo_url.toLowerCase().endsWith('.pdf') ? (
                        <FileImage className="w-12 h-12 text-muted-foreground" />
                      ) : (
                        <img
                          src={selectedBusiness.company_logo_url}
                          alt="Company logo"
                          className="w-full h-full object-contain p-2"
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-3 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{selectedBusiness.order_count}</p>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{formatCurrency(selectedBusiness.total_spent || 0)}</p>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{formatDate(selectedBusiness.created_at)}</p>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" asChild>
                    <Link to={`/admin/messages-center?client=${selectedBusiness.user_id}`}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send Message
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminBusinesses;
