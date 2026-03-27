import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
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
import {
  FileText,
  Plus,
  Loader2,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";
import { format } from "date-fns";

const BlogPosts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    status: "draft",
    author_name: "",
    tags: "",
    seo_title: "",
    seo_description: "",
    featured_image_url: "",
  });

  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const resetForm = () => {
    setForm({ title: "", content: "", excerpt: "", status: "draft", author_name: "", tags: "", seo_title: "", seo_description: "", featured_image_url: "" });
    setEditingPost(null);
  };

  const openEditor = (post?: any) => {
    if (post) {
      setEditingPost(post);
      setForm({
        title: post.title,
        content: post.content || "",
        excerpt: post.excerpt || "",
        status: post.status,
        author_name: post.author_name || "",
        tags: post.tags?.join(", ") || "",
        seo_title: post.seo_title || "",
        seo_description: post.seo_description || "",
        featured_image_url: post.featured_image_url || "",
      });
    } else {
      resetForm();
    }
    setShowEditor(true);
  };

  const savePost = useMutation({
    mutationFn: async () => {
      const slug = form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const tags = form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
      const payload = {
        title: form.title,
        slug: editingPost ? editingPost.slug : slug,
        content: form.content || null,
        excerpt: form.excerpt || null,
        status: form.status,
        author_name: form.author_name || null,
        tags: tags.length ? tags : null,
        seo_title: form.seo_title || null,
        seo_description: form.seo_description || null,
        featured_image_url: form.featured_image_url || null,
        published_at: form.status === "published" ? new Date().toISOString() : null,
      };

      if (editingPost) {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", editingPost.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_posts").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ title: editingPost ? "Post updated" : "Post created" });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      setShowEditor(false);
      resetForm();
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deletePost = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Post deleted" });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    },
  });

  const filtered = posts?.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-foreground" />
            <h1 className="text-xl font-semibold text-foreground">Blog posts</h1>
          </div>
          <Button
            className="bg-primary text-white hover:bg-accent text-sm"
            onClick={() => openEditor()}
          >
            Create blog post
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : !posts?.length ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <div className="mx-auto w-24 h-24 mb-4 flex items-center justify-center">
              <FileText className="h-16 w-16 text-[#c9cccf]" />
            </div>
            <h3 className="font-semibold text-lg text-foreground">Write a blog post</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
              Blog posts are a great way to build a community around your products and your brand.
            </p>
            <Button
              className="mt-4 bg-primary text-white hover:bg-accent"
              onClick={() => openEditor()}
            >
              Create blog post
            </Button>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <Input
                placeholder="Search blog posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm border-border bg-secondary h-9 text-sm"
              />
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground uppercase">
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Author</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 w-24"></th>
                </tr>
              </thead>
              <tbody>
                {filtered?.map((post) => (
                  <tr key={post.id} className="border-b border-border hover:bg-secondary">
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openEditor(post)}
                        className="text-sm font-medium text-primary hover:underline text-left"
                      >
                        {post.title}
                      </button>
                      {post.excerpt && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[400px]">
                          {post.excerpt}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={
                          post.status === "published"
                            ? "bg-green-100 text-green-800"
                            : post.status === "draft"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-600"
                        }
                      >
                        {post.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {post.author_name || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {format(new Date(post.created_at), "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEditor(post)}
                          className="p-1 hover:bg-secondary rounded"
                        >
                          <Pencil className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => deletePost.mutate(post.id)}
                          className="p-1 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Editor dialog */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? "Edit blog post" : "Create blog post"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label className="text-sm">Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="My awesome blog post"
              />
            </div>
            <div>
              <Label className="text-sm">Content</Label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={10}
                placeholder="Write your blog post content here..."
              />
            </div>
            <div>
              <Label className="text-sm">Excerpt</Label>
              <Textarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                rows={3}
                placeholder="A short summary..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">Author</Label>
                <Input
                  value={form.author_name}
                  onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                  placeholder="Author name"
                />
              </div>
              <div>
                <Label className="text-sm">Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-sm">Tags (comma separated)</Label>
              <Input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="health, wellness, supplements"
              />
            </div>
            <div>
              <Label className="text-sm">Featured image URL</Label>
              <Input
                value={form.featured_image_url}
                onChange={(e) => setForm({ ...form, featured_image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="border-t border-border pt-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">SEO</h3>
              <div>
                <Label className="text-xs">SEO Title</Label>
                <Input
                  value={form.seo_title}
                  onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
                  placeholder="Page title for search engines"
                />
              </div>
              <div>
                <Label className="text-xs">SEO Description</Label>
                <Textarea
                  value={form.seo_description}
                  onChange={(e) => setForm({ ...form, seo_description: e.target.value })}
                  rows={2}
                  placeholder="Meta description for search engines"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => { setShowEditor(false); resetForm(); }}>
                Cancel
              </Button>
              <Button
                className="bg-primary text-white hover:bg-accent"
                onClick={() => savePost.mutate()}
                disabled={!form.title || savePost.isPending}
              >
                {savePost.isPending ? "Saving..." : editingPost ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default BlogPosts;
