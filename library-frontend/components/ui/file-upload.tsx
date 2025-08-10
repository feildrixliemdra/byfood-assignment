"use client";

import { useCallback, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  acceptedTypes?: string[];
  maxSizeInMB?: number;
  className?: string;
  disabled?: boolean;
}

export function FileUpload({
  onFileChange,
  acceptedTypes = ["image/png", "image/jpeg", "image/jpg"],
  maxSizeInMB = 5,
  className,
  disabled = false,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!acceptedTypes.includes(file.type)) {
        return `File type not supported. Please upload ${acceptedTypes
          .map((type) => type.split("/")[1].toUpperCase())
          .join(", ")} files.`;
      }

      if (file.size > maxSizeInMB * 1024 * 1024) {
        return `File size must be less than ${maxSizeInMB}MB.`;
      }

      return null;
    },
    [acceptedTypes, maxSizeInMB]
  );

  const handleFile = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError(null);
      setSelectedFile(file);
      onFileChange(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    },
    [onFileChange, validateFile]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled) return;

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [disabled, handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;

      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    },
    [disabled, handleFile]
  );

  const removeFile = useCallback(() => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    onFileChange(null);
  }, [onFileChange]);

  return (
    <div className={cn("space-y-2", className)}>
      {!selectedFile && (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-6 transition-colors",
            dragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            accept={acceptedTypes.join(",")}
            onChange={handleInputChange}
            disabled={disabled}
          />
          <div className="flex flex-col items-center justify-center text-center">
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium text-foreground mb-1">
              Drop your image here, or{" "}
              <span className="text-primary hover:underline">browse</span>
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, JPEG up to {maxSizeInMB}MB
            </p>
          </div>
        </div>
      )}

      {selectedFile && preview && (
        <div className="relative">
          <div className="relative aspect-[3/4] w-32 mx-auto rounded-lg overflow-hidden border">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              sizes="(max-width: 128px) 100vw, 128px"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={removeFile}
            disabled={disabled}
          >
            <X className="h-3 w-3" />
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-2 truncate">
            {selectedFile.name}
          </p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <ImageIcon className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}