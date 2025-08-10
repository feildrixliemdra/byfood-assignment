"use client";

import {
  BookOpen,
  Building2,
  CalendarDays,
  Clock,
  Hash,
  User,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { Book } from "../app/books/columns";

interface BookDetailModalProps {
  book: Book | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookDetailModal({
  book,
  open,
  onOpenChange,
}: BookDetailModalProps) {
  if (!book) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl min-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{book.title}</DialogTitle>
          <Separator />
          <DialogDescription>Book details and information</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Book Cover and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Image
                src={book.image_url}
                alt={book.title}
                width={300}
                height={400}
                className="w-full max-w-[200px] mx-auto object-cover rounded-lg shadow-lg"
              />
            </div>

            <div className="md:col-span-2 space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Book Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Author
                      </p>
                      <p className="font-medium">{book.author}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Publisher
                      </p>
                      <p className="font-medium">{book.publisher}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Year of Publication
                      </p>
                      <p className="font-medium">{book.year_of_publication}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Category
                      </p>
                      <Badge
                        variant="default"
                        className="bg-primary/15 text-primary font-medium px-2 py-1"
                      >
                        {book.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Hash className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        ISBN
                      </p>
                      <p className="font-mono text-sm bg-muted px-2 py-1 rounded inline-block">
                        {book.isbn}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* System Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">System Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Created At
                  </p>
                  <p className="text-sm">{formatDate(book.created_at)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Last Updated
                  </p>
                  <p className="text-sm">{formatDate(book.updated_at)}</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">
                Book ID
              </p>
              <p className="font-mono text-xs bg-muted px-2 py-1 rounded inline-block mt-1">
                {book.id}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
