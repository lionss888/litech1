import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUser, saveUser, saveSession } from "@/lib/storage"
import crypto from "crypto"

// Увеличиваем срок действия cookie при регистрации
export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Проверяем наличие обязательных полей
    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email и пароль обязательны" }, { status: 400 })
    }

    // Проверяем, существует ли пользователь с таким email
    const existingUser = await getUser(email)
    if (existingUser) {
      console.log(`Попытка регистрации с существующим email: ${email}`)
      return NextResponse.json(
        {
          success: false,
          error: "Пользователь с таким email уже существует",
          details: "Пожалуйста, используйте другой email или войдите в систему с существующими учетными данными.",
        },
        { status: 409 },
      )
    }

    // Сохраняем нового пользователя
    const userData = {
      name,
      email,
      password,
    }

    const saveResult = await saveUser(userData)

    if (!saveResult) {
      console.error(`Ошибка при сохранении пользователя: ${email}`)
      return NextResponse.json(
        {
          success: false,
          error: "Не удалось сохранить данные пользователя",
          details: "Возможно, проблема с хранилищем данных. Пожалуйста, попробуйте позже.",
        },
        { status: 500 },
      )
    }

    // Создаем сессию
    const sessionId = crypto.randomBytes(16).toString("hex")
    const sessionResult = await saveSession(sessionId, email)

    if (!sessionResult) {
      console.error(`Ошибка при создании сессии для пользователя: ${email}`)
      return NextResponse.json(
        {
          success: false,
          error: "Не удалось создать сессию",
          details: "Пользователь был зарегистрирован, но не удалось создать сессию. Пожалуйста, попробуйте войти.",
        },
        { status: 500 },
      )
    }

    // Устанавливаем cookie сессии с очень долгим сроком действия
    cookies().set("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365, // 1 год
      path: "/",
      sameSite: "lax",
    })

    return NextResponse.json({
      success: true,
      user: {
        name: name || "",
        email,
      },
    })
  } catch (error) {
    console.error("Ошибка при регистрации:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Ошибка при регистрации",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
