"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// FileUpload not used in edit flow; using custom clickable preview
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
import { BOOK_CATEGORIES } from "@/lib/constants";
import AsteriskLabel from "../../components/asterisk-label";
import { updateBookAction } from "./actions";
import type { Book } from "./columns";

function normalizeCategoryValue(category: string | undefined | null): string {
  if (!category) return "";
  const byValue = BOOK_CATEGORIES.find((c) => c.value === category);
  if (byValue) return byValue.value;
  const byLabel = BOOK_CATEGORIES.find((c) => c.label === category);
  return byLabel ? byLabel.value : "";
}

const editBookSchema = z.object({
  title: z
    .string()
    .min(3, "Title is required, min 3 characters")
    .max(150, "Title is too long, max 150 characters"),
  author: z
    .string()
    .min(3, "Author is required, min 3 characters")
    .max(150, "Author name is too long, max 150 characters"),
  publisher: z
    .string()
    .min(3, "Publisher is required, min 3 characters")
    .max(150, "Publisher name is too long, max 150 characters"),
  isbn: z
    .string()
    .min(10, "ISBN must be at least 10 characters")
    .max(17, "ISBN cannot exceed 17 characters")
    .regex(/^[0-9\-X]+$/, "ISBN can only contain numbers, dashes, and X"),
  year_of_publication: z
    .string()
    .min(4, "Year must be 4 digits")
    .max(4, "Year must be 4 digits")
    .regex(/^\d{4}$/, "Year must be a valid 4-digit number")
    .refine((val) => {
      const year = parseInt(val);
      return year >= 1800 && year <= 2050;
    }, "Year must be between 1800 and 2050"),
  category: z
    .string()
    .min(1, "Category is required")
    .refine((val) => BOOK_CATEGORIES.some((cat) => cat.value === val), {
      message: "Please select a valid category",
    }),
  image_url: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  image_file: z.instanceof(File).optional(),
});

type EditBookFormData = z.infer<typeof editBookSchema>;

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
    if (isSubmitting) return;
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

  const onSubmit = async (data: EditBookFormData) => {
    if (!book) return;
    setIsSubmitting(true);

    try {
      // Simulate file upload to get image URL
      let finalImageUrl = data.image_url || book.image_url || "";

      if (data.image_file) {
        // Mock file upload - in real app, upload to cloud storage
        await new Promise((resolve) => setTimeout(resolve, 1000));
        finalImageUrl = `https://example.com/uploads/${Date.now()}-${
          data.image_file.name
        }`;
      }

      const finalData = {
        ...data,
        image_url: finalImageUrl,
        image_file: undefined, // Remove file from final data
      };

      await updateBookAction(book.id, {
        title: finalData.title,
        author: finalData.author,
        publisher: finalData.publisher,
        isbn: finalData.isbn,
        year_of_publication: finalData.year_of_publication
          ? parseInt(finalData.year_of_publication, 10)
          : undefined,
        category: finalData.category,
        image_url: finalImageUrl || undefined,
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
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={handleChooseImage}
                  className="group relative w-40 h-56 rounded-md overflow-hidden border bg-muted cursor-pointer"
                  aria-label="Change cover image"
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
                      disabled={isSubmitting}
                      aria-label="Reset cover image to original"
                    >
                      Reset to original
                    </Button>
                  </div>
                )}
              </div>
              <FormMessage className="text-red-500" />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
