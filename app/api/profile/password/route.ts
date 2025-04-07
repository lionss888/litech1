import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/auth-utils"
import { verifyPassword, hashPassword } from "@/lib/auth-utils"

// Изменение пароля пользователя
export async function POST(request: Request) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    // Проверка обязательных полей
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Текущий и новый пароли обязательны" }, { status: 400 })
    }

    // Получаем пользователя с паролем
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        password: true,
      },
    })

    if (!user || !user.password) {
      return NextResponse.json({ error: "Пользователь не найден или не имеет пароля" }, { status: 404 })
    }

    // Проверяем текущий пароль
    const isPasswordValid = await verifyPassword(currentPassword, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Неверный текущий пароль" }, { status: 400 })
    }

    // Хешируем новый пароль
    const hashedPassword = await hashPassword(newPassword)

    // Обновляем пароль пользователя
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error changing password:", error)
    return NextResponse.json({ error: "Ошибка при изменении пароля" }, { status: 500 })
  }
}

