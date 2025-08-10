"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "../../components/ui/badge";

import type { BookResponse } from "@/lib/repos/books.types";

export type Book = BookResponse;

interface ColumnsProps {
  onViewDetail: (book: Book) => void;
  onDelete: (book: Book) => void;
  onEdit: (book: Book) => void;
}

export const createColumns = ({
  onViewDetail,
  onDelete,
  onEdit,
}: ColumnsProps): ColumnDef<Book>[] => [
  {
    accessorKey: "image_url",
    header: "Cover",
    cell: ({ row }) => {
      return (
        <Image
          src={row.getValue("image_url")}
          alt={row.getValue("title")}
          className="h-16 w-12 object-cover rounded"
          width={300}
          height={400}
        />
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "author",
    header: "Author",
  },
  {
    accessorKey: "publisher",
    header: "Publisher",
  },
  {
    accessorKey: "year_of_publication",
    header: "Year",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <Badge
        variant="default"
        className="inline-flex items-center  bg-primary/15 text-primary font-medium px-2 py-1 text-xs"
      >
        {row.getValue("category")}
      </Badge>
    ),
  },
  {
    accessorKey: "isbn",
    header: "ISBN",
    cell: ({ row }) => (
      <div className="font-mono text-xs">{row.getValue("isbn")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const book = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer hover:!bg-primary/15 hover:!text-primary"
              onClick={() => onViewDetail(book)}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Detail
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer hover:!bg-primary/15 hover:!text-primary"
              onClick={() => onEdit(book)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(book)}
              className="cursor-pointer hover:!bg-red-50 hover:!text-red-600 dark:hover:!bg-red-950"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span className="text-red-500">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
