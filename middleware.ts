import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Проверяем, есть ли у пользователя сессия
  const user = request.cookies.get("user_data")?.value

  // Получаем текущий путь
  const { pathname } = request.nextUrl

  // Если пользователь не авторизован и пытается получить доступ к защищенным маршрутам
  if (
    !user &&
    (pathname.startsWith("/transactions") ||
      pathname.startsWith("/categories") ||
      pathname.startsWith("/budget") ||
      pathname.startsWith("/reports") ||
      pathname.startsWith("/admin"))
  ) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Если пользователь авторизован и пытается получить доступ к страницам авторизации
  if (user && pathname === "/register") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/transactions/:path*",
    "/categories/:path*",
    "/budget/:path*",
    "/reports/:path*",
    "/admin/:path*",
    "/register",
  ],
}

