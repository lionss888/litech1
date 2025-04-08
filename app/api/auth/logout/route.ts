import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { deleteSession } from "@/lib/storage"

export async function POST() {
  try {
    // Получаем идентификатор сессии из cookie
    const sessionId = cookies().get("sessionId")?.value

    if (sessionId) {
      // Удаляем сессию
      await deleteSession(sessionId)
    }

    // Удаляем cookie сессии
    cookies().delete("sessionId")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Ошибка при выходе из системы:", error)
    return NextResponse.json({ success: false, error: "Ошибка при выходе из системы" }, { status: 500 })
  }
}
