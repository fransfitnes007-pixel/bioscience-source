import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ArrowLeft, Plus, FileText, Trash2 } from "lucide-react";

interface DraftOrder {
  id: string;
  draft_number: string;
  status: string;
  customer_name: string;
  customer_email: string;
  total: number;
  created_at: string;
}

const DraftOrders = () => {
  const [drafts, setDrafts] = useState<DraftOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => { fetchDrafts(); }, []);

  const fetchDrafts = async () => {
    const { data } = await supabase.from("draft_orders").select("*").order("created_at", { ascending: false });
    setDrafts(data || []);
    setIsLoading(false);
  };

  const deleteDraft = async (id: string) => {
    await supabase.from("draft_orders").delete().eq("id", id);
    toast({ title: "Draft deleted" });
    fetchDrafts();
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/orders")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold">Draft orders</h1>
          </div>
          <Button size="sm" onClick={() => navigate("/admin/orders/new")}>
            <Plus className="h-4 w-4 mr-1" /> Create order
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : drafts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p>No draft orders</p>
                <Button variant="link" onClick={() => navigate("/admin/orders/new")}>Create one</Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Draft</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drafts.map(draft => (
                    <TableRow key={draft.id}>
                      <TableCell className="font-mono text-sm font-medium">{draft.draft_number}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(draft.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{draft.customer_name || "No customer"}</p>
                        {draft.customer_email && <p className="text-xs text-muted-foreground">{draft.customer_email}</p>}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                          {draft.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">${Number(draft.total).toFixed(2)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => deleteDraft(draft.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
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

export default DraftOrders;
