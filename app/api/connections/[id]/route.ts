import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/auth-utils"

// Получение API-подключения по ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const connection = await prisma.apiConnection.findUnique({
      where: {
        id: params.id,
      },
      select: {
        id: true,
        name: true,
        provider: true,
        baseUrl: true,
        isActive: true,
        lastSyncAt: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
      },
    })

    if (!connection) {
      return NextResponse.json({ error: "API-подключение не найдено" }, { status: 404 })
    }

    // Проверка, принадлежит ли подключение пользователю
    if (connection.userId !== session.user.id) {
      return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 })
    }

    // Удаляем userId из ответа
    const { userId, ...connectionData } = connection

    return NextResponse.json(connectionData)
  } catch (error) {
    console.error("Error fetching API connection:", error)
    return NextResponse.json({ error: "Ошибка при получении API-подключения" }, { status: 500 })
  }
}

// Обновление API-подключения
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    // Проверяем, существует ли подключение и принадлежит ли оно пользователю
    const existingConnection = await prisma.apiConnection.findUnique({
      where: { id: params.id },
    })

    if (!existingConnection) {
      return NextResponse.json({ error: "API-подключение не найдено" }, { status: 404 })
    }

    if (existingConnection.userId !== session.user.id) {
      return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 })
    }

    const body = await request.json()
    const { name, isActive } = body

    // Проверка обязательных полей
    if (!name) {
      return NextResponse.json({ error: "Название обязательно" }, { status: 400 })
    }

    // Подготавливаем данные для обновления
    const updateData: any = {
      name,
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive === "true" || isActive === true
    }

    // Обновление API-подключения
    const updatedConnection = await prisma.apiConnection.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json(updatedConnection)
  } catch (error) {
    console.error("Error updating API connection:", error)
    return NextResponse.json({ error: "Ошибка при обновлении API-подключения" }, { status: 500 })
  }
}

// Удаление API-подключения
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    // Проверяем, существует ли подключение и принадлежит ли оно пользователю
    const connection = await prisma.apiConnection.findUnique({
      where: { id: params.id },
    })

    if (!connection) {
      return NextResponse.json({ error: "API-подключение не найдено" }, { status: 404 })
    }

    if (connection.userId !== session.user.id) {
      return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 })
    }

    // Удаляем API-подключение
    await prisma.apiConnection.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting API connection:", error)
    return NextResponse.json({ error: "Ошибка при удалении API-подключения" }, { status: 500 })
  }
}

