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

export default function SettingsPage() {
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
              <BreadcrumbPage>General Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h1 className="text-2xl font-bold">General Settings</h1>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-card rounded-xl p-6">
            <h3 className="font-medium text-lg">Library Information</h3>
            <p className="text-sm text-muted-foreground mt-2">Configure basic library details and operating hours</p>
          </div>
          <div className="bg-card rounded-xl p-6">
            <h3 className="font-medium text-lg">Borrowing Rules</h3>
            <p className="text-sm text-muted-foreground mt-2">Set borrowing limits, duration, and penalties</p>
          </div>
          <div className="bg-card rounded-xl p-6">
            <h3 className="font-medium text-lg">Notifications</h3>
            <p className="text-sm text-muted-foreground mt-2">Configure email and SMS notification settings</p>
          </div>
          <div className="bg-card rounded-xl p-6">
            <h3 className="font-medium text-lg">System Preferences</h3>
            <p className="text-sm text-muted-foreground mt-2">Theme, language, and display preferences</p>
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}