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

export default function DatabaseBackupPage() {
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
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/settings">
                Settings
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Database Backup</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h1 className="text-2xl font-bold">Database Backup</h1>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-card rounded-xl p-6">
            <h3 className="font-medium text-lg">Last Backup</h3>
            <p className="text-sm text-muted-foreground mt-2">January 8, 2025 at 3:00 AM</p>
            <p className="text-xs text-green-600 mt-1">Completed successfully</p>
          </div>
          <div className="bg-card rounded-xl p-6">
            <h3 className="font-medium text-lg">Next Scheduled Backup</h3>
            <p className="text-sm text-muted-foreground mt-2">January 9, 2025 at 3:00 AM</p>
            <p className="text-xs text-blue-600 mt-1">Auto-scheduled</p>
          </div>
        </div>
        <div className="bg-muted/50 min-h-[50vh] flex-1 rounded-xl p-4">
          <p className="text-muted-foreground">Backup management controls and history will be implemented here</p>
        </div>
      </div>
    </SidebarInset>
  )
}