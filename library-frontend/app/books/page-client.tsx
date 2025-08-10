"use client";

import { Plus, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as UIPagination,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useBooksList, usePrefetchAdjacentBooks } from "@/lib/query/books";
import type { Book } from "./columns";
import { CreateBookModal } from "./create-book-modal";
import { DataTable } from "./data-table";

export interface Pagination {
  page: number;
  limit: number;
  total_page: number;
  total_item: number;
}

function computePageItems(
  current: number,
  total: number
): Array<number | "ellipsis"> {
  const pages: Array<number | "ellipsis"> = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }
  const showLeft = Math.max(2, current - 1);
  const showRight = Math.min(total - 1, current + 1);
  pages.push(1);
  if (showLeft > 2) pages.push("ellipsis");
  for (let i = showLeft; i <= showRight; i++) pages.push(i);
  if (showRight < total - 1) pages.push("ellipsis");
  pages.push(total);
  return pages;
}

interface BooksPageClientProps {
  books: Book[];
  pagination: Pagination;
}

export default function BooksPageClient({
  books,
  pagination,
}: BooksPageClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const currentPage = useMemo(
    () => Number(searchParams.get("page") ?? pagination.page ?? 1),
    [searchParams, pagination.page]
  );
  const currentLimit = useMemo(
    () => Number(searchParams.get("limit") ?? pagination.limit ?? 10),
    [searchParams, pagination.limit]
  );
  const currentTitle = useMemo(
    () => searchParams.get("title") ?? undefined,
    [searchParams]
  );
  useEffect(() => {
    setSearchQuery(currentTitle ?? "");
  }, [currentTitle]);

  const { data: listData } = useBooksList(
    currentPage,
    currentLimit,
    currentTitle
  );
  const prefetch = usePrefetchAdjacentBooks(
    currentPage,
    currentLimit,
    currentTitle
  );
  const serverRows = listData?.data?.books ?? books;
  const effectivePagination = listData?.data?.pagination ?? pagination;

  const handleCreateSuccess = useCallback((_created: Book) => {
    // Let React Query handle the cache update through invalidation
  }, []);

  const handleUpdateOptimistic = useCallback((_updated: Book) => {
    // Let React Query mutations handle optimistic updates
  }, []);

  const handleDeleteOptimistic = useCallback((_id: string) => {
    // Let React Query mutations handle optimistic updates
  }, []);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    if (debouncedSearchQuery.trim()) {
      params.set("title", debouncedSearchQuery.trim());
    } else {
      params.delete("title");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  }, [debouncedSearchQuery, router]);

  // Auto-search when debounced query changes
  useEffect(() => {
    if (debouncedSearchQuery !== (currentTitle ?? "")) {
      handleSearch();
    }
  }, [debouncedSearchQuery, currentTitle, handleSearch]);

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/">Library Management</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>All Books</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Books Management</h1>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-card rounded-xl p-4 border">
              <h3 className="font-medium text-sm text-muted-foreground">
                Total Books
              </h3>
              <p className="text-2xl font-bold">
                {effectivePagination.total_item}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="pl-10"
              />
            </div>

            <Button
              className="cursor-pointer"
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Create Book
            </Button>
          </div>
        </div>

        <div className="flex-1">
          <DataTable
            data={serverRows}
            onUpdate={handleUpdateOptimistic}
            onDelete={handleDeleteOptimistic}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-end items-center">
          <UIPagination>
            <PaginationContent>
              <PaginationItem onMouseEnter={prefetch}>
                <PaginationPrevious
                  aria-disabled={effectivePagination.page <= 1}
                  className={
                    effectivePagination.page <= 1
                      ? "pointer-events-none opacity-50"
                      : undefined
                  }
                  href={`?page=${Math.max(
                    1,
                    effectivePagination.page - 1
                  )}&limit=${effectivePagination.limit}`}
                />
              </PaginationItem>

              {computePageItems(
                effectivePagination.page,
                effectivePagination.total_page
              ).map((item) => (
                <PaginationItem
                  onMouseEnter={prefetch}
                  key={
                    item === "ellipsis"
                      ? `ellipsis-${Math.random().toString(36).slice(2, 8)}`
                      : `page-${item}`
                  }
                >
                  {item === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href={`?page=${item}&limit=${effectivePagination.limit}`}
                      isActive={item === effectivePagination.page}
                    >
                      {item}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem onMouseEnter={prefetch}>
                <PaginationNext
                  aria-disabled={
                    effectivePagination.page >= effectivePagination.total_page
                  }
                  className={
                    effectivePagination.page >= effectivePagination.total_page
                      ? "pointer-events-none opacity-50"
                      : undefined
                  }
                  href={`?page=${Math.min(
                    effectivePagination.total_page,
                    effectivePagination.page + 1
                  )}&limit=${effectivePagination.limit}`}
                />
              </PaginationItem>
            </PaginationContent>
          </UIPagination>
        </div>

        <CreateBookModal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </SidebarInset>
  );
}
