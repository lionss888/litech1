import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth-utils"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Проверка обязательных полей
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Необходимо заполнить все обязательные поля" }, { status: 400 })
    }

    // Проверка, существует ли пользователь с таким email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Пользователь с таким email уже существует" }, { status: 400 })
    }

    // Хеширование пароля
    const hashedPassword = await hashPassword(password)

    // Создание нового пользователя
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // Возвращаем пользователя без пароля
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Ошибка при регистрации пользователя" }, { status: 500 })
  }
}

