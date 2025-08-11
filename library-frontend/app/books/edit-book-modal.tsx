"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useImageKitUpload } from "@/hooks/use-imagekit-upload";
import { BOOK_CATEGORIES } from "@/lib/constants";
import { useUpdateBook } from "@/lib/query/book-mutations";
import AsteriskLabel from "../../components/asterisk-label";
import {
  type EditBookFormData,
  editBookSchema,
} from "../schema/book-form-schema";
import type { Book } from "./columns";

function normalizeCategoryValue(category: string | undefined | null): string {
  if (!category) return "";
  const byValue = BOOK_CATEGORIES.find((c) => c.value === category);
  if (byValue) return byValue.value;
  const byLabel = BOOK_CATEGORIES.find((c) => c.label === category);
  return byLabel ? byLabel.value : "";
}

interface EditBookModalProps {
  book: Book | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updated: Book) => void;
}

export function EditBookModal({
  book,
  open,
  onOpenChange,
  onSuccess,
}: EditBookModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    book?.image_url ?? null
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<EditBookFormData>({
    resolver: zodResolver(editBookSchema),
    defaultValues: {
      title: book?.title ?? "",
      author: book?.author ?? "",
      publisher: book?.publisher ?? "",
      isbn: book?.isbn ?? "",
      year_of_publication:
        book?.year_of_publication !== undefined && book !== null
          ? String(book.year_of_publication)
          : "",
      category: normalizeCategoryValue(book?.category) ?? "",
      image_url: book?.image_url ?? "",
      image_file: undefined,
    },
  });

  useEffect(() => {
    // Reset form when book changes/open toggles
    form.reset({
      title: book?.title ?? "",
      author: book?.author ?? "",
      publisher: book?.publisher ?? "",
      isbn: book?.isbn ?? "",
      year_of_publication:
        book?.year_of_publication !== undefined && book !== null
          ? String(book.year_of_publication)
          : "",
      category: normalizeCategoryValue(book?.category) ?? "",
      image_url: book?.image_url ?? "",
      image_file: undefined,
    });
    setPreviewUrl(book?.image_url ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book, form.reset]);

  const handleChooseImage = () => {
    if (isSubmitting || imageUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Revoke previous object URL if any
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    const nextUrl = URL.createObjectURL(file);
    setPreviewUrl(nextUrl);
    form.setValue("image_file", file, { shouldDirty: true });
    form.setValue("image_url", "", { shouldDirty: true });
  };

  const canResetImage =
    previewUrl !== (book?.image_url ?? null) && previewUrl !== null;

  const handleResetImage = () => {
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(book?.image_url ?? null);
    form.setValue("image_file", undefined, { shouldDirty: true });
    form.setValue("image_url", book?.image_url ?? "", { shouldDirty: true });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const { mutateAsync: updateBookAsync } = useUpdateBook();
  const {
    upload: uploadToImageKit,
    uploading: imageUploading,
    uploadProgress,
    error: uploadError,
  } = useImageKitUpload();

  const onSubmit = async (data: EditBookFormData) => {
    if (!book) return;
    setIsSubmitting(true);

    try {
      // Upload image to ImageKit if file is provided
      let finalImageUrl = data.image_url || book.image_url || "";

      if (data.image_file) {
        try {
          const uploadResult = await uploadToImageKit({
            file: data.image_file,
            fileName: `book-cover-${book.id}-${Date.now()}-${
              data.image_file.name
            }`,
            folder: "/book-covers",
            tags: ["book", "cover", data.category.toLowerCase(), "updated"],
          });
          finalImageUrl = uploadResult.url;
        } catch (uploadErr) {
          throw new Error(
            `Image upload failed: ${
              uploadErr instanceof Error ? uploadErr.message : "Unknown error"
            }`
          );
        }
      }

      const finalData = {
        ...data,
        image_url: finalImageUrl,
        image_file: undefined, // Remove file from final data
      };

      await updateBookAsync({
        id: book.id,
        payload: {
          title: finalData.title,
          author: finalData.author,
          publisher: finalData.publisher,
          isbn: finalData.isbn,
          year_of_publication: finalData.year_of_publication
            ? parseInt(finalData.year_of_publication, 10)
            : undefined,
          category: finalData.category,
          image_url: finalImageUrl || undefined,
        },
      });

      // Build updated book for optimistic UI
      const updatedBook: Book = {
        ...book,
        title: finalData.title,
        author: finalData.author,
        publisher: finalData.publisher,
        isbn: finalData.isbn,
        year_of_publication: finalData.year_of_publication
          ? parseInt(finalData.year_of_publication, 10)
          : book.year_of_publication,
        category: finalData.category,
        image_url: finalImageUrl || book.image_url || "",
      };

      toast.success("Book updated successfully!", {
        description: `"${data.title}" has been updated.`,
      });

      onOpenChange(false);
      onSuccess(updatedBook);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error("Failed to update book", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!book) return null;

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
          <DialogDescription>
            Update the book details and save your changes.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title <AsteriskLabel />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter book title" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Author <AsteriskLabel />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter author name" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="publisher"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Publisher <AsteriskLabel />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter publisher name" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isbn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    ISBN <AsteriskLabel />
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter ISBN (e.g., 9780123456789)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year_of_publication"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Year of Publication <AsteriskLabel />
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter publication year (e.g., 2024)"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                      autoComplete="off"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const digitsOnly = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 4);
                        field.onChange(digitsOnly);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Category <AsteriskLabel />
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BOOK_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Cover Image - clickable preview to upload new */}
            <div className="space-y-2">
              <FormLabel>Cover Image</FormLabel>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isSubmitting || imageUploading}
                />
                <button
                  type="button"
                  onClick={handleChooseImage}
                  className="group relative w-40 h-56 rounded-md overflow-hidden border bg-muted cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Change cover image"
                  disabled={isSubmitting || imageUploading}
                >
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="Book cover"
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
                      Upload Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end">
                    <span className="w-full text-center text-xs text-white/0 group-hover:text-white py-1">
                      Click to change
                    </span>
                  </div>
                </button>
                {canResetImage && (
                  <div className="mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleResetImage}
                      disabled={isSubmitting || imageUploading}
                      aria-label="Reset cover image to original"
                    >
                      Reset to original
                    </Button>
                  </div>
                )}
              </div>

              {/* Upload Status */}
              {uploadError && (
                <div className="text-sm text-red-500 mt-1">
                  Upload Error: {uploadError}
                </div>
              )}
              {imageUploading && uploadProgress > 0 && (
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                  <Upload className="h-3.5 w-3.5" />
                  Uploading to ImageKit: {uploadProgress}%
                </div>
              )}

              <FormMessage className="text-red-500" />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting || imageUploading}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || imageUploading}
                className="cursor-pointer"
              >
                {(isSubmitting || imageUploading) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {imageUploading
                  ? "Uploading Image..."
                  : isSubmitting
                  ? "Saving..."
                  : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
