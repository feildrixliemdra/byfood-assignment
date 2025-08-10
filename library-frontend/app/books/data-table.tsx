"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookDetailModal } from "./book-detail-modal";
import { type Book, createColumns } from "./columns";
import { DeleteBookModal } from "./delete-book-modal";
import { EditBookModal } from "./edit-book-modal";

interface DataTableProps<TData> {
  data: TData[];
  onDataChange?: () => void;
}

export function DataTable<TData>({
  data,
  onDataChange,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);

  const handleViewDetail = (book: Book) => {
    setSelectedBook(book);
    setModalOpen(true);
  };

  const handleDelete = (book: Book) => {
    setBookToDelete(book);
    setDeleteModalOpen(true);
  };

  const handleEdit = (book: Book) => {
    setBookToEdit(book);
    setEditModalOpen(true);
  };

  const handleBookDeleted = () => {
    // Refresh the data if callback is provided
    if (onDataChange) {
      onDataChange();
    }
  };

  const columns = createColumns({
    onViewDetail: handleViewDetail,
    onDelete: handleDelete,
    onEdit: handleEdit,
  });

  const table = useReactTable({
    data,
    columns: columns as ColumnDef<TData>[],
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <BookDetailModal
        book={selectedBook}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      <DeleteBookModal
        book={bookToDelete}
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onBookDeleted={handleBookDeleted}
      />

      <EditBookModal
        book={bookToEdit}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSuccess={onDataChange ?? (() => {})}
      />
    </div>
  );
}
