"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  type BookFormData,
  bookFormSchema,
} from "@/app/schema/book-form-schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
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
import type { ApiResponse } from "@/lib/http";
import { useCreateBook } from "@/lib/query/book-mutations";
import type { CreateBookResponse } from "@/lib/repos/books.types";
import AsteriskLabel from "../../components/asterisk-label";
import type { Book } from "./columns";

type CreateBookFormData = BookFormData;

interface CreateBookModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (created: Book) => void;
}

export function CreateBookModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateBookModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Only support file upload for cover image in create modal

  const form = useForm<CreateBookFormData>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: "",
      author: "",
      publisher: "",
      isbn: "",
      year_of_publication: "",
      category: "",
      image_url: "",
      image_file: undefined,
    },
  });

  const { mutateAsync: createBookAsync } = useCreateBook();

  const onSubmit = async (data: CreateBookFormData) => {
    setIsSubmitting(true);

    try {
      // Simulate file upload to get image URL
      let finalImageUrl = data.image_url || "";

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

      const res = await createBookAsync({
        title: finalData.title,
        author: finalData.author,
        publisher: finalData.publisher,
        isbn: finalData.isbn,
        year_of_publication: parseInt(finalData.year_of_publication, 10),
        category: finalData.category,
        image_url: finalImageUrl || undefined,
      });

      const newId = (res as ApiResponse<CreateBookResponse>).data?.id;
      if (!newId) {
        throw new Error("Failed to create book (no id returned)");
      }

      const nowIso = new Date().toISOString();
      const createdBook: Book = {
        id: newId,
        title: finalData.title,
        author: finalData.author,
        publisher: finalData.publisher,
        isbn: finalData.isbn,
        year_of_publication: parseInt(finalData.year_of_publication, 10),
        category: finalData.category,
        image_url: finalImageUrl || "",
        created_at: nowIso,
        updated_at: nowIso,
      };

      // Success
      toast.success("Book created successfully!", {
        description: `"${data.title}" has been added to the library.`,
      });

      form.reset();
      onOpenChange(false);
      onSuccess(createdBook);
    } catch (error) {
      // Error
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error("Failed to create book", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Book</DialogTitle>
          <DialogDescription>
            Add a new book to the library collection.
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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

            {/* Image Upload Section */}
            <div className="space-y-2">
              <FormLabel>Cover Image</FormLabel>
              <FormField
                control={form.control}
                name="image_file"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUpload
                        onFileChange={(file) => {
                          field.onChange(file);
                          if (file) {
                            form.setValue("image_url", "");
                          }
                        }}
                        acceptedTypes={["image/png", "image/jpeg", "image/jpg"]}
                        maxSizeInMB={5}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <Upload className="h-3.5 w-3.5" /> Choose a cover image
                (PNG/JPG, up to 5MB)
              </div>
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
                {isSubmitting ? "Creating..." : "Create Book"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
