"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import type { Book } from "./columns";
import { DataTable } from "./data-table";

// Mock data based on the API structure
const mockBooks: Book[] = [
  {
    id: "e8d6d056-2813-45fd-9a16-27a31347bec3",
    isbn: "9780134685991",
    title: "Effective Java",
    author: "Joshua Bloch",
    publisher: "Addison-Wesley Professional",
    year_of_publication: 2017,
    category: "Programming",
    image_url: "https://covers.openlibrary.org/b/isbn/9780134685991-L.jpg",
    created_at: "2025-08-08T12:55:40.753741Z",
    updated_at: "2025-08-08T12:57:43.924752Z",
  },
  {
    id: "2712ded8-9f58-44a1-bd7d-50d1d7f4023f",
    isbn: "9780201633610",
    title: "Design Patterns: Elements of Reusable Object-Oriented Software",
    author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
    publisher: "Addison-Wesley Professional",
    year_of_publication: 1994,
    category: "Programming",
    image_url: "https://covers.openlibrary.org/b/isbn/9780201633610-L.jpg",
    created_at: "2025-08-08T12:55:40.753741Z",
    updated_at: "2025-08-08T12:57:43.924752Z",
  },
  {
    id: "b7b9ebeb-95b7-44b7-a0c8-e339560bba12",
    isbn: "9780137081073",
    title: "The Clean Coder: A Code of Conduct for Professional Programmers",
    author: "Robert C. Martin",
    publisher: "Prentice Hall",
    year_of_publication: 2011,
    category: "Programming",
    image_url: "https://covers.openlibrary.org/b/isbn/9780137081073-L.jpg",
    created_at: "2025-08-08T12:55:40.753741Z",
    updated_at: "2025-08-08T12:57:43.924752Z",
  },
  {
    id: "8d076c60-3227-43c7-964e-f76ded6e765f",
    isbn: "9780596517748",
    title: "JavaScript: The Good Parts",
    author: "Douglas Crockford",
    publisher: "O'Reilly Media",
    year_of_publication: 2008,
    category: "Programming",
    image_url: "https://covers.openlibrary.org/b/isbn/9780596517748-L.jpg",
    created_at: "2025-08-08T12:55:40.753741Z",
    updated_at: "2025-08-08T12:57:43.924752Z",
  },
  {
    id: "55aec5e2-a1c8-4891-ba84-2caa9cdca5d7",
    isbn: "9780134190440",
    title: "The Go Programming Language",
    author: "Alan Donovan, Brian Kernighan",
    publisher: "Addison-Wesley Professional",
    year_of_publication: 2015,
    category: "Programming",
    image_url: "https://covers.openlibrary.org/b/isbn/9780134190440-L.jpg",
    created_at: "2025-08-08T12:55:40.753741Z",
    updated_at: "2025-08-08T12:57:43.924752Z",
  },
  {
    id: "4e98bc29-22b4-4382-a404-90f62b889dfa",
    isbn: "9781617291784",
    title: "Go in Action",
    author: "William Kennedy, Brian Ketelsen, Erik St. Martin",
    publisher: "Manning Publications",
    year_of_publication: 2015,
    category: "Programming",
    image_url: "https://covers.openlibrary.org/b/isbn/9781617291784-L.jpg",
    created_at: "2025-08-08T12:55:40.753741Z",
    updated_at: "2025-08-08T12:57:43.924752Z",
  },
  {
    id: "a2b9d465-eadc-4efd-8109-60ece568d412",
    isbn: "9781449373320",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    publisher: "O'Reilly Media",
    year_of_publication: 2017,
    category: "Programming",
    image_url: "https://covers.openlibrary.org/b/isbn/9781449373320-L.jpg",
    created_at: "2025-08-08T12:55:40.753741Z",
    updated_at: "2025-08-08T12:57:43.924752Z",
  },
  {
    id: "3624142d-dbce-4f3c-8e96-7243092ecce5",
    isbn: "9780134494166",
    title:
      "Clean Architecture: A Craftsman's Guide to Software Structure and Design",
    author: "Robert C. Martin",
    publisher: "Prentice Hall",
    year_of_publication: 2017,
    category: "Programming",
    image_url: "https://covers.openlibrary.org/b/isbn/9780134494166-L.jpg",
    created_at: "2025-08-08T12:55:40.753741Z",
    updated_at: "2025-08-08T12:57:43.924752Z",
  },
  {
    id: "82df258d-2b9f-4a81-92d7-016ea32b7f6f",
    isbn: "9781617294549",
    title: "Microservices Patterns: With examples in Java",
    author: "Chris Richardson",
    publisher: "Manning Publications",
    year_of_publication: 2018,
    category: "Programming",
    image_url: "https://covers.openlibrary.org/b/isbn/9781617294549-L.jpg",
    created_at: "2025-08-08T12:55:40.753741Z",
    updated_at: "2025-08-08T12:57:43.924752Z",
  },
  {
    id: "e68dbc79-63e8-4e9f-9846-b7f575d1c9ff",
    isbn: "9780132350884",
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin",
    publisher: "Prentice Hall",
    year_of_publication: 2008,
    category: "Programming",
    image_url: "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg",
    created_at: "2025-08-08T12:55:40.753741Z",
    updated_at: "2025-08-08T12:57:43.924752Z",
  },
];

const mockPagination = {
  page: 1,
  limit: 10,
  total_page: 5,
  total_item: 42,
};

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState("");

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
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Books Management</h1>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-card rounded-xl p-4 border">
              <h3 className="font-medium text-sm text-muted-foreground">
                Total Books
              </h3>
              <p className="text-2xl font-bold">1,247</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <DataTable data={mockBooks} />
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end items-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">
                  {mockPagination.total_page}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </SidebarInset>
  );
}
