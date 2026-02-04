import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, FileImage, File, Loader2, Check } from "lucide-react";

interface LogoUploaderProps {
  onUploadComplete: (url: string) => void;
  onRemove?: () => void;
  existingLogoUrl?: string | null;
  bucketPath: string; // e.g., "applications/{id}" or "profiles/{userId}"
  className?: string;
  compact?: boolean;
}

const LogoUploader = ({
  onUploadComplete,
  onRemove,
  existingLogoUrl,
  bucketPath,
  className = "",
  compact = false,
}: LogoUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingLogoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const ACCEPTED_TYPES = ["image/png", "application/pdf"];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Only PNG and PDF files are accepted";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 5MB";
    }
    return null;
  };

  const uploadFile = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      toast({
        title: "Invalid file",
        description: error,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Generate file path
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "png";
      const filePath = `${bucketPath}/logo.${fileExt}`;

      // Simulate progress (actual upload doesn't provide progress)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      const { data, error: uploadError } = await supabase.storage
        .from("company-logos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      clearInterval(progressInterval);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("company-logos")
        .getPublicUrl(filePath);

      setUploadProgress(100);
      setPreviewUrl(urlData.publicUrl);
      onUploadComplete(urlData.publicUrl);

      toast({
        title: "Logo uploaded",
        description: "Your company logo has been uploaded successfully",
      });
    } catch (err: any) {
      console.error("Upload error:", err);
      toast({
        title: "Upload failed",
        description: err.message || "Failed to upload logo",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        uploadFile(files[0]);
      }
    },
    [bucketPath]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onRemove?.();
  };

  const isPdf = previewUrl?.toLowerCase().endsWith(".pdf");

  if (compact) {
    return (
      <div className={`space-y-3 ${className}`}>
        {previewUrl ? (
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg border border-border overflow-hidden bg-secondary/30 flex items-center justify-center">
              {isPdf ? (
                <File className="w-8 h-8 text-muted-foreground" />
              ) : (
                <img
                  src={previewUrl}
                  alt="Company logo"
                  className="w-full h-full object-contain p-1"
                />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Logo uploaded</p>
              <p className="text-xs text-muted-foreground">
                {isPdf ? "PDF file" : "PNG image"}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleRemove}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Logo
              </>
            )}
          </Button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.pdf,image/png,application/pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-foreground bg-foreground/5"
            : previewUrl
            ? "border-green-500/50 bg-green-500/5"
            : "border-border hover:border-foreground/50 hover:bg-secondary/30"
        }`}
      >
        {isUploading ? (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 mx-auto text-foreground animate-spin" />
            <div className="space-y-2">
              <p className="font-heading font-medium text-foreground">Uploading...</p>
              <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
            </div>
          </div>
        ) : previewUrl ? (
          <div className="space-y-4">
            <div className="w-32 h-32 mx-auto rounded-lg border border-border overflow-hidden bg-secondary/30 flex items-center justify-center">
              {isPdf ? (
                <File className="w-16 h-16 text-muted-foreground" />
              ) : (
                <img
                  src={previewUrl}
                  alt="Company logo preview"
                  className="w-full h-full object-contain p-2"
                />
              )}
            </div>
            <div className="flex items-center justify-center gap-2 text-green-500">
              <Check className="w-5 h-5" />
              <span className="font-heading font-medium">Logo uploaded</span>
            </div>
            <p className="font-body text-sm text-muted-foreground">
              Click or drag to replace
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-secondary/50 flex items-center justify-center">
              <FileImage className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-heading font-medium text-foreground">
                {isDragging ? "Drop your logo here" : "Upload your company logo"}
              </p>
              <p className="font-body text-sm text-muted-foreground mt-1">
                Drag and drop or click to browse
              </p>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.pdf,image/png,application/pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Requirements */}
      <div className="mt-4 p-4 bg-secondary/30 rounded-lg">
        <p className="font-heading text-sm font-medium text-foreground mb-2">Requirements:</p>
        <ul className="font-body text-sm text-muted-foreground space-y-1">
          <li>• PNG or PDF format</li>
          <li>• Transparent background required</li>
          <li>• Maximum file size: 5MB</li>
          <li>• Recommended: 300x100px minimum</li>
        </ul>
      </div>

      {/* Remove Button */}
      {previewUrl && onRemove && (
        <Button
          type="button"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            handleRemove();
          }}
          className="mt-4 w-full"
        >
          <X className="mr-2 h-4 w-4" />
          Remove Logo
        </Button>
      )}
    </div>
  );
};

export default LogoUploader;
