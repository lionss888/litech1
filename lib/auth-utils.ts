import { getServerSession as nextAuthGetServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import type { Session } from "next-auth"

export async function getServerSession(): Promise<Session | null> {
  return await nextAuthGetServerSession(authOptions)
}

