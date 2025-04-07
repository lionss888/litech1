import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/auth-utils"
import { decryptData } from "@/lib/encryption"
import { syncTransactions } from "@/lib/api-services"

// Синхронизация данных через API-подключение
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    // Получаем подключение с зашифрованными данными
    const connection = await prisma.apiConnection.findUnique({
      where: { id: params.id },
    })

    if (!connection) {
      return NextResponse.json({ error: "API-подключение не найдено" }, { status: 404 })
    }

    if (connection.userId !== session.user.id) {
      return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 })
    }

    if (!connection.isActive) {
      return NextResponse.json({ error: "API-подключение неактивно" }, { status: 400 })
    }

    // Расшифровываем данные для доступа к API
    const apiKey = decryptData(connection.apiKey)
    const apiSecret = connection.apiSecret ? decryptData(connection.apiSecret) : null

    // Получаем последнюю дату синхронизации
    const lastSyncDate = connection.lastSyncAt || new Date(0)

    // Синхронизируем транзакции
    const result = await syncTransactions({
      provider: connection.provider,
      apiKey,
      apiSecret,
      baseUrl: connection.baseUrl,
      userId: session.user.id,
      connectionId: connection.id,
      lastSyncDate,
    })

    // Обновляем дату последней синхронизации
    await prisma.apiConnection.update({
      where: { id: params.id },
      data: {
        lastSyncAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      syncedTransactions: result.count,
      message: `Успешно синхронизировано ${result.count} транзакций`,
    })
  } catch (error: any) {
    console.error("Error syncing data:", error)
    return NextResponse.json(
      {
        error: "Ошибка при синхронизации данных",
        details: error.message || "Неизвестная ошибка",
      },
      { status: 500 },
    )
  }
}

