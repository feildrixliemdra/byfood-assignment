"use client";

import {
  BarChart3,
  BookAIcon,
  BookOpen,
  FileText,
  LibraryBig,
  Plus,
  Search,
  Settings,
  Shield,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Books Management",
      url: "#",
      icon: BookAIcon,
      items: [
        {
          title: "All Books",
          url: "/books",
          icon: BookOpen,
          isActive: false,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  // Helper function to check if a path is active
  const isPathActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname === path;
  };

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/books">
                <div className="bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <LibraryBig className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-xl">
                    Library Dashboard
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {data.navMain.map((item) => {
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="font-medium cursor-default hover:bg-transparent">
                    <item.icon className="size-4" />
                    {item.title}
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                      {item.items.map((subItem) => {
                        const isActive = isPathActive(subItem.url);

                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive}
                              className={`hover:!bg-primary/15 hover:!text-primary transition-colors ${
                                isActive
                                  ? "!bg-primary/15 !text-primary font-medium"
                                  : ""
                              }`}
                            >
                              <Link href={subItem.url}>
                                <subItem.icon className="size-4" />
                                {subItem.title}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
