"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          // Enhanced error styling
          "--error-bg": "oklch(0.9818 0.0054 95.0986)",
          "--error-text": "oklch(0.6368 0.2078 25.3313)",
          "--error-border": "oklch(0.8368 0.1078 25.3313)",
          // Enhanced warning styling
          "--warning-bg": "oklch(0.9818 0.0054 85.0986)",
          "--warning-text": "oklch(0.6368 0.2078 65.3313)",
          "--warning-border": "oklch(0.8368 0.1078 65.3313)",
          // Success styling (existing but enhanced)
          "--success-bg": "oklch(0.9818 0.0054 135.0986)",
          "--success-text": "oklch(0.4368 0.2078 145.3313)",
          "--success-border": "oklch(0.7368 0.1078 145.3313)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          error: "!bg-red-50 !text-red-900 !border-red-200 dark:!bg-red-950/50 dark:!text-red-100 dark:!border-red-800",
          success: "!bg-green-50 !text-green-900 !border-green-200 dark:!bg-green-950/50 dark:!text-green-100 dark:!border-green-800",
          warning: "!bg-amber-50 !text-amber-900 !border-amber-200 dark:!bg-amber-950/50 dark:!text-amber-100 dark:!border-amber-800",
          info: "!bg-blue-50 !text-blue-900 !border-blue-200 dark:!bg-blue-950/50 dark:!text-blue-100 dark:!border-blue-800",
          description: "!text-inherit !opacity-90",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
