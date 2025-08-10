"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
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

export type Book = {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  year_of_publication: number;
  category: string;
  image_url: string;
  created_at: string;
  updated_at: string;
};

export const columns: ColumnDef<Book>[] = [
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
      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
        {row.getValue("category")}
      </span>
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
              onClick={() => {
                // Handle view detail
                console.log("View detail:", book.id);
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Detail
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer hover:!bg-primary/15 hover:!text-primary"
              onClick={() => {
                // Handle edit
                console.log("Edit:", book.id);
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                // Handle delete
                console.log("Delete:", book.id);
              }}
              className="cursor-pointer hover:!bg-primary/15 hover:!text-primary"
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
