import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function MembersPage() {
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
              <BreadcrumbLink href="/">
                Library Management
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>All Members</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h1 className="text-2xl font-bold">Members Management</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-card rounded-xl p-4">
            <h3 className="font-medium text-sm text-muted-foreground">Total Members</h3>
            <p className="text-2xl font-bold">568</p>
          </div>
          <div className="bg-card rounded-xl p-4">
            <h3 className="font-medium text-sm text-muted-foreground">Active Members</h3>
            <p className="text-2xl font-bold">432</p>
          </div>
          <div className="bg-card rounded-xl p-4">
            <h3 className="font-medium text-sm text-muted-foreground">New This Month</h3>
            <p className="text-2xl font-bold">24</p>
          </div>
          <div className="bg-card rounded-xl p-4">
            <h3 className="font-medium text-sm text-muted-foreground">Overdue Books</h3>
            <p className="text-2xl font-bold">8</p>
          </div>
        </div>
        <div className="bg-muted/50 min-h-[60vh] flex-1 rounded-xl p-4">
          <p className="text-muted-foreground">Members table will be implemented here</p>
        </div>
      </div>
    </SidebarInset>
  )
}