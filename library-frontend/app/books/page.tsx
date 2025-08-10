import { bookRepo } from "@/lib/repos/books";
import type { Book as BookRow } from "./columns";
import BooksPageClient from "./page-client";

export default async function BooksPage(props: {
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  const sp = await props.searchParams;
  const page = Number(sp?.page ?? 1);
  const limit = Number(sp?.limit ?? 10);

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
