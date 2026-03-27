import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  FileImage,
  Upload,
  Search,
  Loader2,
  Trash2,
  Link2,
  Filter,
} from "lucide-react";
import { format } from "date-fns";

const formatFileSize = (bytes: number) => {
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${bytes} B`;
};

const ContentFiles = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const { data: files, isLoading } = useQuery({
    queryKey: ["content-files"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("media_files")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const uploadFile = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${file.name}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("content-files")
      .upload(path, file);

    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("content-files").getPublicUrl(path);

    const { error: dbError } = await supabase.from("media_files").insert({
      file_name: file.name,
      file_url: urlData.publicUrl,
      file_type: file.type.startsWith("image") ? "image" : file.type.startsWith("video") ? "video" : "document",
      file_size: file.size,
      mime_type: file.type,
    });

    if (dbError) {
      toast({ title: "Error", description: dbError.message, variant: "destructive" });
    } else {
      toast({ title: "File uploaded" });
      queryClient.invalidateQueries({ queryKey: ["content-files"] });
    }
    setUploading(false);
  };

  const deleteFiles = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from("media_files").delete().in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Files deleted" });
      setSelected([]);
      queryClient.invalidateQueries({ queryKey: ["content-files"] });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      Array.from(fileList).forEach(uploadFile);
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  const filtered = files?.filter((f) =>
    f.file_name.toLowerCase().includes(search.toLowerCase())
  );

  const getFileExtension = (name: string) => name.split(".").pop()?.toUpperCase() || "FILE";

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileImage className="h-5 w-5 text-foreground" />
            <h1 className="text-xl font-semibold text-foreground">Files</h1>
          </div>
          <div className="flex gap-2">
            {selected.length > 0 && (
              <Button
                variant="outline"
                className="text-red-400 border-red-200"
                onClick={() => deleteFiles.mutate(selected)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete ({selected.length})
              </Button>
            )}
            <Button
              className="bg-foreground text-background hover:bg-foreground/90 text-sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
              Upload files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <span className="text-sm text-muted-foreground font-medium">All</span>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 border-border bg-secondary h-9 text-sm"
              />
            </div>
            <Button variant="outline" size="sm" className="border-border">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !filtered?.length ? (
            <div className="text-center py-16">
              <FileImage className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold text-foreground">No files uploaded</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Upload images, videos, and documents to manage your content.
              </p>
              <Button
                className="mt-4 bg-foreground text-background hover:bg-foreground/90"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload files
              </Button>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground uppercase">
                  <th className="px-4 py-3 w-8">
                    <Checkbox
                      checked={selected.length === filtered.length && filtered.length > 0}
                      onCheckedChange={(c) =>
                        setSelected(c ? filtered.map((f) => f.id) : [])
                      }
                    />
                  </th>
                  <th className="px-4 py-3"></th>
                  <th className="px-4 py-3">File name</th>
                  <th className="px-4 py-3">Alt text</th>
                  <th className="px-4 py-3">Date added</th>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3">References</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((file) => (
                  <tr key={file.id} className="border-b border-border hover:bg-secondary">
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selected.includes(file.id)}
                        onCheckedChange={() => toggleSelect(file.id)}
                      />
                    </td>
                    <td className="px-4 py-2 w-16">
                      {file.file_type === "image" ? (
                        <img
                          src={file.file_url}
                          alt={file.alt_text || file.file_name}
                          className="h-10 w-10 rounded object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-secondary flex items-center justify-center text-xs font-medium text-muted-foreground">
                          {getFileExtension(file.file_name)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-foreground truncate max-w-[300px]">
                          {file.file_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getFileExtension(file.file_name)}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {file.alt_text || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {format(new Date(file.created_at), "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {file.file_size ? formatFileSize(Number(file.file_size)) : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      —
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ContentFiles;
