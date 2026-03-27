import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Menu,
  Plus,
  Loader2,
  GripVertical,
  Trash2,
  Pencil,
} from "lucide-react";

const ContentMenus = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [editingMenu, setEditingMenu] = useState<any>(null);
  const [newMenuTitle, setNewMenuTitle] = useState("");
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemUrl, setNewItemUrl] = useState("");

  const { data: menus, isLoading } = useQuery({
    queryKey: ["nav-menus"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nav_menus")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: menuItems } = useQuery({
    queryKey: ["nav-menu-items", editingMenu?.id],
    queryFn: async () => {
      if (!editingMenu) return [];
      const { data, error } = await supabase
        .from("nav_menu_items")
        .select("*")
        .eq("menu_id", editingMenu.id)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!editingMenu,
  });

  const createMenu = useMutation({
    mutationFn: async () => {
      const handle = newMenuTitle.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const { error } = await supabase.from("nav_menus").insert({
        title: newMenuTitle,
        handle,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Menu created" });
      queryClient.invalidateQueries({ queryKey: ["nav-menus"] });
      setShowCreate(false);
      setNewMenuTitle("");
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const addMenuItem = useMutation({
    mutationFn: async () => {
      const maxOrder = menuItems?.length || 0;
      const { error } = await supabase.from("nav_menu_items").insert({
        menu_id: editingMenu.id,
        title: newItemTitle,
        url: newItemUrl,
        sort_order: maxOrder,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Menu item added" });
      queryClient.invalidateQueries({ queryKey: ["nav-menu-items"] });
      setNewItemTitle("");
      setNewItemUrl("");
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteMenuItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("nav_menu_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nav-menu-items"] });
    },
  });

  const deleteMenu = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("nav_menus").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Menu deleted" });
      queryClient.invalidateQueries({ queryKey: ["nav-menus"] });
    },
  });

  // Get menu items summary per menu
  const { data: allMenuItems } = useQuery({
    queryKey: ["all-menu-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nav_menu_items")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const getMenuItemNames = (menuId: string) => {
    const items = allMenuItems?.filter((i) => i.menu_id === menuId) || [];
    return items.map((i) => i.title).join(", ") || "No items";
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Menu className="h-5 w-5 text-foreground" />
            <h1 className="text-xl font-semibold text-foreground">Menus</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-border text-sm text-foreground">
              URL redirects
            </Button>
            <Button
              className="bg-foreground text-background hover:bg-foreground/90 text-sm"
              onClick={() => setShowCreate(true)}
            >
              Create menu
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground uppercase">
                  <th className="px-4 py-3">Menu</th>
                  <th className="px-4 py-3">Menu items</th>
                  <th className="px-4 py-3 w-20"></th>
                </tr>
              </thead>
              <tbody>
                {menus?.map((menu) => (
                  <tr
                    key={menu.id}
                    className="border-b border-border hover:bg-secondary cursor-pointer"
                    onClick={() => setEditingMenu(menu)}
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-primary hover:underline">
                        {menu.title}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {getMenuItemNames(menu.id)}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => deleteMenu.mutate(menu.id)}
                        className="p-1 hover:bg-red-900/20 rounded text-muted-foreground hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create menu dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Create menu</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-sm">Title</Label>
              <Input
                value={newMenuTitle}
                onChange={(e) => setNewMenuTitle(e.target.value)}
                placeholder="e.g. Footer menu"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button
                className="bg-foreground text-background hover:bg-foreground/90"
                onClick={() => createMenu.mutate()}
                disabled={!newMenuTitle || createMenu.isPending}
              >
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit menu dialog */}
      <Dialog open={!!editingMenu} onOpenChange={() => setEditingMenu(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit: {editingMenu?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Menu items</h3>
              {menuItems?.map((item) => (
                <div key={item.id} className="flex items-center gap-2 p-2 bg-secondary rounded-lg">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.url}</p>
                  </div>
                  <button
                    onClick={() => deleteMenuItem.mutate(item.id)}
                    className="p-1 hover:bg-red-900/20 rounded"
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-400" />
                  </button>
                </div>
              ))}
              {!menuItems?.length && (
                <p className="text-sm text-muted-foreground py-4 text-center">No items in this menu</p>
              )}
            </div>
            <div className="border-t border-border pt-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Add menu item</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Title</Label>
                  <Input
                    value={newItemTitle}
                    onChange={(e) => setNewItemTitle(e.target.value)}
                    placeholder="e.g. Contact"
                    className="h-9 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">URL</Label>
                  <Input
                    value={newItemUrl}
                    onChange={(e) => setNewItemUrl(e.target.value)}
                    placeholder="e.g. /contact"
                    className="h-9 text-sm"
                  />
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => addMenuItem.mutate()}
                disabled={!newItemTitle || addMenuItem.isPending}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add item
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ContentMenus;
