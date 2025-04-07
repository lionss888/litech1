import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const error = searchParams.get("error")

  // Получаем сохраненное состояние из cookie
  const cookies = request.headers.get("cookie")
  const cookieState = cookies
    ?.split(";")
    .find((c) => c.trim().startsWith("oauth_state="))
    ?.split("=")[1]

  // Проверяем наличие ошибок или несоответствие состояния
  if (error || !code || state !== cookieState) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}?error=oauth_error`)
  }

  try {
    // Обмениваем код на токены
    const tokens = await getGoogleTokens(code)

    // Получаем информацию о пользователе
    const googleUser = await getGoogleUser(tokens.access_token)

    // Создаем JWT токен для нашего приложения
    const user = {
      id: googleUser.id,
      name: googleUser.name,
      email: googleUser.email,
      picture: googleUser.picture,
      provider: "google",
    }

    // Перенаправляем на главную страницу с данными пользователя
    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}`)

    // Сохраняем данные пользователя в cookie
    response.cookies.set("user_data", JSON.stringify(user), {
      httpOnly: false, // Чтобы клиент мог прочитать
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 дней
    })

    return response
  } catch (error) {
    console.error("Google OAuth Error:", error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}?error=oauth_error`)
  }
}

async function getGoogleTokens(code: string) {
  const url = "https://oauth2.googleapis.com/token"
  const values = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID || "",
    client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/google/callback`,
    grant_type: "authorization_code",
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  })

  return response.json()
}

async function getGoogleUser(access_token: string) {
  const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })

  return response.json()
}

