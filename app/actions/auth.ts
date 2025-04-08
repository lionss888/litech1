"use server"

import { cookies } from "next/headers"
import { getUser, getSession, deleteSession } from "@/lib/storage"

// Функция для проверки аутентификации пользователя
export async function checkAuth() {
  try {
    // Получаем идентификатор сессии из cookie
    const sessionId = cookies().get("sessionId")?.value

    if (!sessionId) {
      return { authenticated: false, user: null }
    }

    // Получаем идентификатор пользователя из сессии
    const userId = await getSession(sessionId)

    if (!userId) {
      return { authenticated: false, user: null }
    }

    // Получаем данные пользователя
    const user = await getUser(userId)

    if (!user) {
      return { authenticated: false, user: null }
    }

    // Возвращаем данные аутентифицированного пользователя
    return {
      authenticated: true,
      user: {
        name: user.name || "",
        email: user.email,
      },
    }
  } catch (error) {
    console.error("Ошибка при проверке аутентификации:", error)
    return { authenticated: false, user: null }
  }
}

// Серверная функция для выхода пользователя из системы
export async function logoutUser() {
  try {
    // Получаем идентификатор сессии из cookie
    const sessionId = cookies().get("sessionId")?.value

    if (sessionId) {
      // Удаляем сессию
      await deleteSession(sessionId)
    }

    // Удаляем cookie сессии
    cookies().delete("sessionId")

    return { success: true }
  } catch (error) {
    console.error("Ошибка при выходе из системы:", error)
    return { success: false, error: "Ошибка при выходе из системы" }
  }
}
