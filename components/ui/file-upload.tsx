"use client";

import { cn, extractFileName, extractPublicId, isImage, uploadToS3 } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Upload, X, File, Loader2, RefreshCw, Plus } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";


export function FileUpload({
  value,
  onChange,
  multiple = false,
  accept = "image/*",
  maxFiles = 10,
  maxSize = 10,
  className,
  disabled = false,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) {
      const urls = Array.isArray(value) ? value : [value];
      const files = urls.map((url) => ({
        url,
        publicId: extractPublicId(url),
        originalName: extractFileName(url),
      }));
      setUploadedFiles(files);
    } else {
      setUploadedFiles([]);
    }
  }, [value]);




  const handleFileSelect = async (files: FileList) => {
    if (disabled) return;

    const fileArray = Array.from(files);
    
    if (multiple && uploadedFiles.length + fileArray.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    if (!multiple && fileArray.length > 1) {
      toast.error("Only one file allowed");
      return;
    }

    const oversizedFiles = fileArray.filter(file => file.size > maxSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error(`Files must be smaller than ${maxSize}MB`);
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = fileArray.map(uploadToS3);
      const newFiles = await Promise.all(uploadPromises);

      if (multiple) {
        const allFiles = [...uploadedFiles, ...newFiles];
        setUploadedFiles(allFiles);
        onChange(allFiles.map(f => f.url));
      } else {
        setUploadedFiles(newFiles);
        onChange(newFiles[0].url);
      }

      toast.success(`${newFiles.length} file${newFiles.length === 1 ? '' : 's'} uploaded!`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = (index: number) => {
    if (disabled) return;

    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);

    if (multiple) {
      onChange(newFiles.map(f => f.url));
    } else {
      onChange("");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const hasFiles = uploadedFiles.length > 0;

  const handleClick = () => {
    if (!disabled && !hasFiles) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-all duration-200",
          !hasFiles && "cursor-pointer hover:border-primary/50 hover:bg-accent/50",
          isDragOver && "border-primary bg-accent/50 scale-[1.02]",
          disabled && "cursor-not-allowed opacity-50",
          !hasFiles && "min-h-[200px] flex items-center justify-center"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          disabled={disabled}
        />

        {hasFiles && !disabled && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="absolute top-2 right-2 z-10"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            disabled={isUploading}
          >
            {multiple ? (
              <>
                <Plus className="mr-1 h-3 w-3" />
                Add another
              </>
            ) : (
              <>
                <RefreshCw className="mr-1 h-3 w-3" />
                Change
              </>
            )}
          </Button>
        )}

        {!hasFiles ? (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {isUploading ? "Uploading..." : "Drop files here or click to browse"}
              </p>
              <p className="text-xs text-muted-foreground">
                {accept === "image/*" ? "Images" : "Files"} up to {maxSize}MB
                {multiple && ` (max ${maxFiles} files)`}
              </p>
            </div>
            {isUploading && <Loader2 className="mx-auto h-6 w-6 animate-spin mt-4" />}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedFiles.map((file, index) => (
              <FilePreview
                key={`${file.publicId}-${index}`}
                file={file}
                onRemove={() => handleRemoveFile(index)}
                disabled={disabled}
              />
            ))}
          </div>
        )}

        {isUploading && uploadedFiles.length > 0 && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}
      </div>

    </div>
  );
}

interface FilePreviewProps {
  file: UploadedFile;
  onRemove: () => void;
  disabled?: boolean;
}

function FilePreview({ file, onRemove, disabled }: FilePreviewProps) {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div
      className="relative aspect-square group"
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <div className="w-full h-full rounded-lg overflow-hidden border bg-muted">
        {isImage(file.url) ? (
          <img
            src={file.url}
            alt={file.originalName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-2">
            <File className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-xs text-center truncate w-full" title={file.originalName}>
              {file.originalName}
            </p>
          </div>
        )}
      </div>

      {/* Delete Button */}
      {showDelete && !disabled && (
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}

interface FileUploadProps {
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  accept?: string;
  maxFiles?: number;
  maxSize?: number; // in MB
  className?: string;
  disabled?: boolean;
}

export interface UploadedFile {
  url: string;
  publicId: string;
  originalName: string;
}
