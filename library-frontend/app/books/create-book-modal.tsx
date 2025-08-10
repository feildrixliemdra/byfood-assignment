"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
import { useState } from "react";
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
import AsteriskLabel from "../../components/asterisk-label";

const createBookSchema = z.object({
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

type CreateBookFormData = z.infer<typeof createBookSchema>;

interface CreateBookModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateBookModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateBookModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Only support file upload for cover image in create modal

  const form = useForm<CreateBookFormData>({
    resolver: zodResolver(createBookSchema),
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

      // Mock API call with random success/failure
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // 90% success rate for demonstration
          if (Math.random() > 0.1) {
            resolve(finalData);
          } else {
            reject(new Error("Failed to create book. Please try again."));
          }
        }, 1000); // 1 second delay for API call after upload
      });

      // Success
      toast.success("Book created successfully!", {
        description: `"${data.title}" has been added to the library.`,
      });

      form.reset();
      onOpenChange(false);
      onSuccess();
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
