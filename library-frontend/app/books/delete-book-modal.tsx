"use client";

import { Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteBook } from "@/lib/query/book-mutations";
import type { Book } from "./columns";

interface DeleteBookModalProps {
  book: Book | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookDeleted: (id: string) => void;
}

export function DeleteBookModal({
  book,
  open,
  onOpenChange,
  onBookDeleted,
}: DeleteBookModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const { mutateAsync: deleteBookAsync } = useDeleteBook();

  const handleDelete = async () => {
    if (!book) return;

    setIsDeleting(true);

    try {
      await deleteBookAsync(book.id);
      toast.success(`"${book.title}" has been deleted successfully`);
      onBookDeleted(book.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete book. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!book) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-w-[90vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-500" />
            Delete Book
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this book? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border">
            <div className="flex gap-3 min-w-0">
              <Image
                src={book.image_url ?? ""}
                alt={book.title}
                className="h-16 w-12 object-cover rounded flex-shrink-0"
                width={48}
                height={64}
              />
              <div className="min-w-0 flex-1 overflow-hidden">
                <h3
                  className="font-semibold text-sm truncate w-full"
                  title={book.title}
                >
                  {book.title}
                </h3>
                <p
                  className="text-sm text-gray-600 dark:text-gray-400 truncate w-full"
                  title={`by ${book.author}`}
                >
                  by {book.author}
                </p>
                <p
                  className="text-xs text-gray-500 dark:text-gray-500 truncate w-full"
                  title={`Published by ${book.publisher}`}
                >
                  {book.publisher}
                </p>
                <p
                  className="text-xs text-gray-500 dark:text-gray-500 truncate w-full"
                  title={`ISBN: ${book.isbn}`}
                >
                  ISBN: {book.isbn}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="min-w-[100px] cursor-pointer"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
