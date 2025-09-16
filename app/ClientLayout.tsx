"use client"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { NextAuthProvider } from "@/components/auth/nextauth-provider"
import { TRPCProvider } from "@/lib/trpc/provider"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <TRPCProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <NextAuthProvider>{children}</NextAuthProvider>
      </ThemeProvider>
    </TRPCProvider>
  )
}
