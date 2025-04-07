import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/auth-utils"
import { encryptData } from "@/lib/encryption"

// Получение всех API-подключений пользователя
export async function GET(request: Request) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const connections = await prisma.apiConnection.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        name: true,
        provider: true,
        isActive: true,
        lastSyncAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(connections)
  } catch (error) {
    console.error("Error fetching API connections:", error)
    return NextResponse.json({ error: "Ошибка при получении API-подключений" }, { status: 500 })
  }
}

// Создание нового API-подключения
export async function POST(request: Request) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const body = await request.json()
    const { name, provider, apiKey, apiSecret, baseUrl } = body

    // Проверка обязательных полей
    if (!name || !provider || !apiKey) {
      return NextResponse.json({ error: "Не все обязательные поля заполнены" }, { status: 400 })
    }

    // Проверка, что для кастомного API указан базовый URL
    if (provider === "custom" && !baseUrl) {
      return NextResponse.json({ error: "Для пользовательского API необходимо указать базовый URL" }, { status: 400 })
    }

    // Шифруем чувствительные данные
    const encryptedApiKey = encryptData(apiKey)
    const encryptedApiSecret = apiSecret ? encryptData(apiSecret) : null

    // Создание нового API-подключения
    const connection = await prisma.apiConnection.create({
      data: {
        name,
        provider,
        apiKey: encryptedApiKey,
        apiSecret: encryptedApiSecret,
        baseUrl: provider === "custom" ? baseUrl : null,
        userId: session.user.id,
      },
      select: {
        id: true,
        name: true,
        provider: true,
        isActive: true,
        lastSyncAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(connection)
  } catch (error) {
    console.error("Error creating API connection:", error)
    return NextResponse.json({ error: "Ошибка при создании API-подключения" }, { status: 500 })
  }
}

