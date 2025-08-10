import { bookRepo } from "@/lib/repos/books";
import type { Book as BookRow } from "./columns";
import BooksPageClient from "./page-client";

export default async function BooksPage({
  searchParams,
}: {
  searchParams?: { page?: string; limit?: string };
}) {
  const page = Number(searchParams?.page ?? 1);
  const limit = Number(searchParams?.limit ?? 10);

  const res = await bookRepo.list({ page, limit });
  const books = res.data?.books ?? [];
  const pagination = res.data?.pagination ?? {
    page,
    limit,
    total_page: 1,
    total_item: books.length,
  };

  // Cast API type to table row type if identical
  return (
    <BooksPageClient
      books={books as unknown as BookRow[]}
      pagination={pagination}
    />
  );
}
