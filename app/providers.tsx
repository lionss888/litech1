"use client"

import type React from "react"

import { AuthProvider } from "./auth-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

