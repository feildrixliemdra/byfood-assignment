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

export default function LibraryStatisticsPage() {
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
              <BreadcrumbPage>Library Statistics</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h1 className="text-2xl font-bold">Library Statistics</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-card rounded-xl p-6">
            <h3 className="font-medium text-sm text-muted-foreground">Monthly Circulation</h3>
            <p className="text-3xl font-bold">2,847</p>
            <p className="text-xs text-green-600">+12% from last month</p>
          </div>
          <div className="bg-card rounded-xl p-6">
            <h3 className="font-medium text-sm text-muted-foreground">Popular Categories</h3>
            <p className="text-3xl font-bold">Fiction</p>
            <p className="text-xs text-muted-foreground">34% of total borrowings</p>
          </div>
          <div className="bg-card rounded-xl p-6">
            <h3 className="font-medium text-sm text-muted-foreground">Average Return Time</h3>
            <p className="text-3xl font-bold">12.5</p>
            <p className="text-xs text-muted-foreground">days</p>
          </div>
        </div>
        <div className="bg-muted/50 min-h-[50vh] flex-1 rounded-xl p-4">
          <p className="text-muted-foreground">Charts and detailed statistics will be implemented here</p>
        </div>
      </div>
    </SidebarInset>
  )
}