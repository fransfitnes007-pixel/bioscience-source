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

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  source_page: string | null;
  status: string;
  notes: string | null;
  responded_at: string | null;
  created_at: string;
}

const ITEMS_PER_PAGE = 10;

const statusOptions = [
  { value: "new", label: "New" },
  { value: "responded", label: "Responded" },
  { value: "closed", label: "Closed" },
];

const ContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("contact_messages")
        .select("*", { count: "exact" });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      if (searchValue) {
        query = query.or(
          `name.ilike.%${searchValue}%,email.ilike.%${searchValue}%,subject.ilike.%${searchValue}%`
        );
      }

      const { count } = await query;
      setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));

      const { data, error } = await query
        .order("created_at", { ascending: false })
        .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [page, searchValue, statusFilter, toast]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleRowClick = (message: ContactMessage) => {
    setSelectedMessage(message);
    setNotes(message.notes || "");
    setNewStatus(message.status);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!selectedMessage) return;

    setIsSaving(true);
    try {
      const updateData: Record<string, any> = {
        status: newStatus,
        notes,
      };

      // Set responded_at if status changed to responded
      if (newStatus === "responded" && selectedMessage.status !== "responded") {
        updateData.responded_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("contact_messages")
        .update(updateData)
        .eq("id", selectedMessage.id);

      if (error) throw error;

      toast({
        title: "Saved",
        description: "Message updated successfully",
      });

      setIsDialogOpen(false);
      fetchMessages();
    } catch (error) {
      console.error("Error updating message:", error);
      toast({
        title: "Error",
        description: "Failed to update message",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const columns = [
    {
      key: "name",
      header: "From",
      cell: (msg: ContactMessage) => (
        <div>
          <p className="font-medium">{msg.name}</p>
          <p className="text-sm text-muted-foreground">{msg.email}</p>
        </div>
      ),
    },
    {
      key: "subject",
      header: "Subject",
      cell: (msg: ContactMessage) => (
        <span className="text-sm">{msg.subject || "No Subject"}</span>
      ),
    },
    {
      key: "message",
      header: "Message",
      cell: (msg: ContactMessage) => (
        <span className="text-sm text-muted-foreground line-clamp-1 max-w-xs">
          {msg.message}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (msg: ContactMessage) => <StatusBadge status={msg.status} />,
    },
    {
      key: "created_at",
      header: "Date",
      cell: (msg: ContactMessage) => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(msg.created_at), "MMM d, yyyy")}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Contact Messages</h1>
          <p className="text-muted-foreground mt-1">
            Manage incoming contact form submissions
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Messages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FilterPanel
              searchValue={searchValue}
              onSearchChange={(value) => {
                setSearchValue(value);
                setPage(1);
              }}
              searchPlaceholder="Search by name, email, or subject..."
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
              data={messages}
              isLoading={isLoading}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              onRowClick={handleRowClick}
              emptyMessage="No messages found"
            />
          </CardContent>
        </Card>

        {/* Message Detail Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Message Details</DialogTitle>
            </DialogHeader>

            {selectedMessage && (
              <div className="space-y-6">
                {/* Sender Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Name</Label>
                    <p className="font-medium">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                  {selectedMessage.phone && (
                    <div>
                      <Label className="text-muted-foreground">Phone</Label>
                      <p className="font-medium">{selectedMessage.phone}</p>
                    </div>
                  )}
                  {selectedMessage.source_page && (
                    <div>
                      <Label className="text-muted-foreground">Source Page</Label>
                      <p className="font-medium">{selectedMessage.source_page}</p>
                    </div>
                  )}
                </div>

                {/* Subject */}
                {selectedMessage.subject && (
                  <div>
                    <Label className="text-muted-foreground">Subject</Label>
                    <p className="font-medium">{selectedMessage.subject}</p>
                  </div>
                )}

                {/* Message */}
                <div>
                  <Label className="text-muted-foreground">Message</Label>
                  <p className="font-medium p-3 rounded-lg bg-muted mt-1 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
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
                      <Label className="text-muted-foreground">Received</Label>
                      <p className="font-medium">
                        {format(new Date(selectedMessage.created_at), "PPpp")}
                      </p>
                    </div>
                  </div>

                  {selectedMessage.responded_at && (
                    <div>
                      <Label className="text-muted-foreground">Responded At</Label>
                      <p className="font-medium">
                        {format(new Date(selectedMessage.responded_at), "PPpp")}
                      </p>
                    </div>
                  )}

                  <div>
                    <Label>Internal Notes</Label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes about this message..."
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
                    <Button
                      variant="outline"
                      onClick={() => window.open(`mailto:${selectedMessage.email}`, "_blank")}
                    >
                      Reply via Email
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

export default ContactMessages;
