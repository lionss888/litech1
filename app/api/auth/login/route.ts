import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUser, saveSession } from "@/lib/storage"
import crypto from "crypto"

// Тестовые пользователи для прямого доступа в API
const TEST_USERS = {
  "admin@example.com": {
    name: "Администратор",
    email: "admin@example.com",
    password: "admin123",
  },
  "test@example.com": {
    name: "Тестовый пользователь",
    email: "test@example.com",
    password: "test123",
  },
}

// Увеличиваем срок действия cookie при входе
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    console.log(`Попытка входа: ${email}`)

    // Проверяем наличие обязательных полей
    if (!email || !password) {
      console.log("Отсутствуют обязательные поля")
      return NextResponse.json(
        {
          success: false,
          error: "Email и пароль обязательны",
          details: "Пожалуйста, заполните все обязательные поля.",
        },
        { status: 400 },
      )
    }

    // Сначала проверяем, является ли пользователь тестовым
    if (TEST_USERS[email]) {
      // Проверяем пароль тестового пользователя
      if (TEST_USERS[email].password === password) {
        // Создаем сессию для тестового пользователя
        const sessionId = crypto.randomBytes(16).toString("hex")
        await saveSession(sessionId, email)

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
            name: TEST_USERS[email].name,
            email: TEST_USERS[email].email,
          },
        })
      } else {
        console.log(`Неверный пароль для тестового пользователя: ${email}`)
        return NextResponse.json(
          {
            success: false,
            error: "Неверный пароль",
            details: "Пожалуйста, проверьте правильность пароля.",
          },
          { status: 401 },
        )
      }
    }

    // Если пользователь не тестовый, получаем его из хранилища
    const user = await getUser(email)

    // Проверяем существование пользователя
    if (!user) {
      console.log(`Пользователь не найден: ${email}`)
      return NextResponse.json(
        {
          success: false,
          error: "Пользователь с таким email не найден",
          details: "Пожалуйста, проверьте правильность email или зарегистрируйтесь.",
        },
        { status: 401 },
      )
    }

    console.log(`Пользователь найден: ${email}`, user)

    // Проверяем правильность пароля
    if (user.password !== password) {
      console.log(`Неверный пароль для пользователя: ${email}`)
      return NextResponse.json(
        {
          success: false,
          error: "Неверный пароль",
          details: "Пожалуйста, проверьте правильность пароля.",
        },
        { status: 401 },
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
          details: "Пожалуйста, попробуйте позже.",
        },
        { status: 500 },
      )
    }

    console.log(`Сессия создана для пользователя: ${email}, sessionId: ${sessionId}`)

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
        name: user.name || "",
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Ошибка при входе:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Ошибка при входе в систему",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
