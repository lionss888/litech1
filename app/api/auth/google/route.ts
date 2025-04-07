import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // Генерируем случайное состояние для защиты от CSRF
  const state = Math.random().toString(36).substring(2, 15)

  // Сохраняем состояние в cookie для проверки при возврате
  const response = NextResponse.redirect(getGoogleAuthURL(state))
  response.cookies.set("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, // 10 минут
  })

  return response
}

function getGoogleAuthURL(state: string) {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth"

  const options = {
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/google/callback`,
    client_id: process.env.GOOGLE_CLIENT_ID || "",
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"].join(
      " ",
    ),
    state,
  }

  const qs = new URLSearchParams(options)
  return `${rootUrl}?${qs.toString()}`
}

